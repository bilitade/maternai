import { NextRequest, NextResponse } from 'next/server';
import type { AIRequestBody, AIResponseBody } from '@/lib/types';
import { getFallbackResponse, isApiKeyConfigured } from '@/lib/aiFallbacks';
import { requireSession } from '@/lib/apiAuth';

/** Primary model — Google Gemma 4 31B via OpenRouter */
const PRIMARY_MODEL = 'google/gemma-4-31b-it';

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

const LOCALE_INSTRUCTION: Record<string, string> = {
  am: 'Respond in simple Amharic (አማርኛ). Use short sentences.',
  en: 'Respond in simple English.',
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

function systemPrompt(action: string, locale?: string): string {
  const base = SYSTEM_PROMPTS[action];
  const lang = locale === 'am' ? LOCALE_INSTRUCTION.am : LOCALE_INSTRUCTION.en;
  return `${base}\n${lang}`;
}

function offline(body: AIRequestBody): NextResponse<AIResponseBody> {
  return NextResponse.json({
    text: getFallbackResponse(body),
    source: 'offline',
  });
}

function extractMessageText(data: {
  choices?: Array<{ message?: { content?: string; reasoning?: string } }>;
}): string | undefined {
  const message = data.choices?.[0]?.message;
  const content = message?.content?.trim();
  if (content && !/^user safety:/i.test(content)) {
    return content;
  }
  const reasoning = message?.reasoning?.trim();
  if (reasoning && reasoning.length > 20) {
    return reasoning;
  }
  return content || undefined;
}

async function callOpenRouter(
  body: AIRequestBody
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
        model: PRIMARY_MODEL,
        max_tokens: 400,
        reasoning: { effort: 'none' },
        messages: [
          { role: 'system', content: systemPrompt(body.action, body.locale) },
          { role: 'user', content: buildUserMessage(body) },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    console.error(
      `OpenRouter ${PRIMARY_MODEL} HTTP ${response.status}:`,
      errBody.slice(0, 200)
    );
    return { ok: false, status: response.status };
  }

  const data = await response.json();
  const text = extractMessageText(data);
  if (!text) {
    console.error(`OpenRouter ${PRIMARY_MODEL} returned empty content`);
    return { ok: false, status: 502 };
  }
  return { ok: true, text };
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

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
    const result = await callOpenRouter(body);
    if (result.ok) {
      return NextResponse.json({ text: result.text, source: 'ai' });
    }
    console.error(`${PRIMARY_MODEL} failed — using offline fallback`);
    return offline(body);
  } catch (err) {
    console.error('OpenRouter error:', err);
    return offline(body);
  }
}
