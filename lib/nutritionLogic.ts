import type { NutritionProfile } from './types';

export type AnemiaClass =
  | 'normal'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'unknown';

export function classifyAnemia(hb: number | undefined): AnemiaClass {
  if (hb === undefined || hb <= 0) return 'unknown';
  if (hb >= 11) return 'normal';
  if (hb >= 9) return 'mild';
  if (hb >= 7) return 'moderate';
  return 'severe';
}

export function calcBMI(
  weightKg: number | undefined,
  heightCm: number | undefined
): number | null {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function muacStatus(muacCm: number | undefined): 'normal' | 'malnutrition' | 'unknown' {
  if (!muacCm || muacCm <= 0) return 'unknown';
  return muacCm < 23 ? 'malnutrition' : 'normal';
}

export function dietaryDiversityStatus(
  score: number | undefined
): 'adequate' | 'poor' | 'unknown' {
  if (score === undefined) return 'unknown';
  return score >= 5 ? 'adequate' : 'poor';
}

/** Composite nutrition score 0–100 per draft weights (simplified when data missing). */
export function calcNutritionScore(profile: NutritionProfile): number | null {
  const weights = {
    diversity: 25,
    muac: 15,
    iron: 15,
    calcium: 10,
    hb: 10,
    meals: 25,
  };

  let total = 0;
  let weightSum = 0;

  if (profile.dietaryDiversityScore !== undefined) {
    const pts =
      profile.dietaryDiversityScore >= 5
        ? weights.diversity
        : (profile.dietaryDiversityScore / 5) * weights.diversity;
    total += pts;
    weightSum += weights.diversity;
  }

  if (profile.muacCm !== undefined && profile.muacCm > 0) {
    total += profile.muacCm >= 23 ? weights.muac : weights.muac * 0.3;
    weightSum += weights.muac;
  }

  if (profile.ironAdherencePct !== undefined) {
    total += (profile.ironAdherencePct / 100) * weights.iron;
    weightSum += weights.iron;
  }

  if (profile.calciumAdherencePct !== undefined) {
    total += (profile.calciumAdherencePct / 100) * weights.calcium;
    weightSum += weights.calcium;
  }

  if (profile.hemoglobin !== undefined && profile.hemoglobin > 0) {
    const hbPts =
      profile.hemoglobin >= 11
        ? weights.hb
        : profile.hemoglobin >= 9
          ? weights.hb * 0.7
          : profile.hemoglobin >= 7
            ? weights.hb * 0.4
            : 0;
    total += hbPts;
    weightSum += weights.hb;
  }

  if (weightSum === 0) return null;
  return Math.round((total / weightSum) * 100);
}

export function nutritionScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs improvement';
  return 'High nutritional risk';
}
