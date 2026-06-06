import { NextRequest, NextResponse } from 'next/server';
import type { AIRequestBody, AIResponseBody } from '@/lib/types';
import { getFallbackResponse, isApiKeyConfigured } from '@/lib/aiFallbacks';

/** Models tried in order — openrouter/free auto-routes to an available free model */
const MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
] as const;

const SYSTEM_PROMPTS: Record<string, string> = {
  dangerSigns: `You are a maternal health AI assistant for Ethiopian pregnant women.
Analyze the reported symptoms and respond with:
1. A plain-language assessment (2 sentences max)
2. A clear action instruction
3. Whether this is URGENT (requires immediate health center visit) or MONITOR
Be compassionate but direct. Never diagnose. Always recommend professional care.
Respond in 3 short paragraphs. No markdown.`,

  nutrition: `You are a maternal nutrition advisor for Ethiopian women.
Give one short, specific, actionable nutrition tip for this week of pregnancy
using only Ethiopian foods (injera, shiro, gomen, misir, ater kik, eggs, milk,
liver, atmit, sesame, ayib, chickpeas, teff).
Maximum 3 sentences. Friendly and encouraging tone. No markdown.`,

  wellness: `You are a compassionate maternal wellness companion for Ethiopian women.
Based on the wellness score, provide a brief, warm, supportive message.
If score is below 40: gently introduce the concept of antenatal or postpartum
mood changes and normalize seeking help.
Maximum 3 sentences. No clinical language. No markdown.`,
};

function buildUserMessage(body: AIRequestBody): string {
  const { action, payload } = body;
  if (action === 'dangerSigns') {
    return `A pregnant woman at ${payload.weeks} weeks reports: ${payload.signs?.join(', ')}.`;
  }
  if (action === 'nutrition') {
    const rf = payload.riskFactors?.length
      ? payload.riskFactors.join(', ')
      : 'none';
    return `Week ${payload.weeks} pregnancy. Risk factors: ${rf}.`;
  }
  return `Wellness score: ${payload.score}/100. Consecutive low-score weeks: ${payload.lowWeeks}.`;
}

function offline(body: AIRequestBody): NextResponse<AIResponseBody> {
  return NextResponse.json({
    text: getFallbackResponse(body),
    source: 'offline',
  });
}

async function callOpenRouter(
  body: AIRequestBody,
  model: string
): Promise<{ ok: true; text: string } | { ok: false; status: number }> {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_APP_URL ?? 'https://materna-ai.vercel.app',
        'X-Title': 'MaternaAI Ethiopia',
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[body.action] },
          { role: 'user', content: buildUserMessage(body) },
        ],
      }),
    }
  );

  if (!response.ok) {
    console.error(`OpenRouter ${model} HTTP ${response.status}`);
    return { ok: false, status: response.status };
  }

  const data = await response.json();
  const text: string | undefined = data.choices?.[0]?.message?.content?.trim();
  if (!text) return { ok: false, status: 502 };
  return { ok: true, text };
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<AIResponseBody>> {
  let body: AIRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { text: 'Invalid request body.', source: 'offline' },
      { status: 400 }
    );
  }

  if (!body.action || !SYSTEM_PROMPTS[body.action]) {
    return NextResponse.json(
      { text: 'Invalid AI action.', source: 'offline' },
      { status: 400 }
    );
  }

  if (!isApiKeyConfigured()) {
    return offline(body);
  }

  try {
    for (const model of MODELS) {
      const result = await callOpenRouter(body, model);
      if (result.ok) {
        return NextResponse.json({ text: result.text, source: 'ai' });
      }
    }
    console.error('All OpenRouter models failed — using offline fallback');
    return offline(body);
  } catch (err) {
    console.error('OpenRouter error:', err);
    return offline(body);
  }
}
