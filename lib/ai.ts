import type { AIResponseBody } from './types';

async function callAI(
  action: 'dangerSigns' | 'nutrition' | 'wellness',
  payload: Record<string, unknown>
): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) throw new Error('AI request failed');
  const data: AIResponseBody = await res.json();
  return data.text;
}

export async function analyzeDangerSigns(
  signs: string[],
  weeks: number
): Promise<string> {
  return callAI('dangerSigns', { signs, weeks });
}

export async function getNutritionTip(
  weeks: number,
  riskFactors: string[]
): Promise<string> {
  return callAI('nutrition', { weeks, riskFactors });
}

export async function getWellnessMessage(
  score: number,
  lowWeeks: number
): Promise<string> {
  return callAI('wellness', { score, lowWeeks });
}
