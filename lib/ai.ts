import type { Locale } from './i18n';
import type { AIResponseBody } from './types';

export interface AIResult {
  text: string;
  source: 'ai' | 'offline';
}

async function callAI(
  action: 'dangerSigns' | 'nutrition' | 'wellness',
  payload: Record<string, unknown>,
  locale: Locale = 'en'
): Promise<AIResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload, locale }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `AI request failed (${res.status})`);
  }
  const data: AIResponseBody = await res.json();
  if (!data.text?.trim()) {
    throw new Error('AI returned an empty response');
  }
  return { text: data.text, source: data.source ?? 'offline' };
}

export async function analyzeDangerSigns(
  signs: string[],
  weeks: number,
  locale: Locale = 'en'
): Promise<AIResult> {
  return callAI('dangerSigns', { signs, weeks }, locale);
}

export async function getNutritionTip(
  weeks: number,
  riskFactors: string[],
  locale: Locale = 'en'
): Promise<AIResult> {
  return callAI('nutrition', { weeks, riskFactors }, locale);
}

export async function getWellnessMessage(
  score: number,
  lowWeeks: number,
  locale: Locale = 'en'
): Promise<AIResult> {
  return callAI('wellness', { score, lowWeeks }, locale);
}
