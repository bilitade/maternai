import type { AIRequestBody } from '@/lib/types';

export function isApiKeyConfigured(): boolean {
  const key = process.env.OPENROUTER_API_KEY;
  return Boolean(key && key !== 'your_openrouter_key_here' && key.length > 10);
}

export function getFallbackResponse(body: AIRequestBody): string {
  const { action, payload } = body;

  if (action === 'dangerSigns') {
    const signs = payload.signs ?? [];
    const hasHeadache = signs.some((s) => /headache/i.test(s));
    const hasVision = signs.some((s) => /vision/i.test(s));
    const hasSwelling = signs.some((s) => /swelling/i.test(s));
    const hasBleeding = signs.some((s) => /bleeding/i.test(s));

    if (hasBleeding) {
      return 'Vaginal bleeding during pregnancy requires urgent attention. Go to your nearest health center or hospital immediately. Do not wait. Your Health Extension Worker should be notified.';
    }
    if (hasHeadache && hasVision && hasSwelling) {
      return 'These symptoms together may indicate preeclampsia, a serious condition that needs immediate care. Go to a health center right away. Your HEW has been notified to follow up with you.';
    }
    if (signs.length > 0) {
      return 'The symptoms you reported need professional assessment. Please contact your HEW or visit a health center today. If symptoms worsen, go immediately — do not wait for your next scheduled visit.';
    }
    return 'Continue monitoring your symptoms and attend all ANC visits. Contact your HEW if anything changes.';
  }

  if (action === 'nutrition') {
    const weeks = payload.weeks ?? 20;
    if (weeks <= 13) {
      return 'This week, try shiro with injera and gomen — iron-rich and gentle on nausea. Small, frequent meals help. Drink clean water throughout the day.';
    }
    if (weeks <= 26) {
      return 'Focus on iron and protein: misir wot, eggs, and shiro with teff injera. Add gomen or kale several times this week to support your blood levels and your baby\'s growth.';
    }
    return 'You need steady energy for the final weeks. Atmit (barley porridge), injera, and ater kik provide lasting energy. Stay hydrated and eat protein at every meal.';
  }

  const score = payload.score ?? 50;
  if (score < 40) {
    return 'Your wellness score suggests you may be going through a difficult time. Feeling low during or after pregnancy is common and has a name — you are not alone. Please speak with your HEW or a trusted health worker. Support is available.';
  }
  return 'Thank you for checking in. Keep connecting with your HEW, eating regular meals, and resting when you can. Small steps each day make a difference.';
}
