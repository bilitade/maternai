import type { MotherProfile, RiskResult } from './types';

export function calculateRisk(profile: MotherProfile): RiskResult {
  const factors: string[] = [];
  let score = 0;

  if (profile.age >= 35) {
    score += 2;
    factors.push('Age 35 or older');
  }
  if (profile.age < 19) {
    score += 2;
    factors.push('Age under 19');
  }
  if (profile.previousCSection) {
    score += 2;
    factors.push('Previous C-section');
  }
  if (profile.previousStillbirth) {
    score += 2;
    factors.push('Previous stillbirth');
  }
  if (profile.multiplePregnancy) {
    score += 2;
    factors.push('Multiple pregnancy');
  }
  if (profile.hypertension) {
    score += 3;
    factors.push('Hypertension');
  }
  if (profile.diabetes) {
    score += 2;
    factors.push('Diabetes');
  }
  if (profile.hiv) {
    score += 3;
    factors.push('HIV');
  }
  if (profile.anemia) {
    score += 2;
    factors.push('Anemia');
  }
  if (profile.tb) {
    score += 2;
    factors.push('TB');
  }
  if (profile.gravidity >= 4) {
    score += 1;
    factors.push('Grand multipara (4+ pregnancies)');
  }
  if (profile.familySupport === 'no') {
    score += 1;
    factors.push('Limited family support');
  }

  return {
    riskLevel: score >= 5 ? 'high' : score >= 2 ? 'monitoring' : 'low',
    riskFactors: factors,
    riskScore: score,
  };
}

export function calcGestationalWeeks(lmp: string): number {
  const ms = Date.now() - new Date(lmp).getTime();
  return Math.max(0, Math.floor(ms / (7 * 24 * 60 * 60 * 1000)));
}

export function getTrimester(weeks: number): 1 | 2 | 3 {
  if (weeks <= 13) return 1;
  if (weeks <= 26) return 2;
  return 3;
}
