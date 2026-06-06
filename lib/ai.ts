import type { AIResponseBody } from './types';

export interface AIResult {
  text: string;
  source: 'ai' | 'offline';
}

async function callAI(
  action: 'dangerSigns' | 'nutrition' | 'wellness',
  payload: Record<string, unknown>
): Promise<AIResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) throw new Error('AI request failed');
  const data: AIResponseBody = await res.json();
  return { text: data.text, source: data.source ?? 'offline' };
}

export async function analyzeDangerSigns(
  signs: string[],
  weeks: number
): Promise<AIResult> {
  return callAI('dangerSigns', { signs, weeks });
}

export async function getNutritionTip(
  weeks: number,
  riskFactors: string[]
): Promise<AIResult> {
  return callAI('nutrition', { weeks, riskFactors });
}

export async function getWellnessMessage(
  score: number,
  lowWeeks: number
): Promise<AIResult> {
  return callAI('wellness', { score, lowWeeks });
}
