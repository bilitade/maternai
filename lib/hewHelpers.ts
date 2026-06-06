import type { DemoMother, MotherProfile } from './types';
import { getANCContacts, getWellnessHistory } from './storage';
import { ANC_CONTACTS } from '@/data/ancContacts';

export function profileToDemoMother(profile: MotherProfile): DemoMother {
  const savedANC = getANCContacts();
  const ancCompleted = savedANC
    .filter((c) => c.completed)
    .map((c) => c.id);

  const wellnessHistory = getWellnessHistory();
  const recentLowScores = wellnessHistory
    .slice(-3)
    .filter((e) => e.score < 40).length;

  const flags: DemoMother['flags'] = [];
  if (recentLowScores >= 2) flags.push('wellness_concern');
  if (profile.mealsPerDay < 2) flags.push('nutrition_concern');

  const missedANC = ANC_CONTACTS.some((contact) => {
    const saved = savedANC.find((c) => c.id === contact.id);
    if (saved?.completed) return false;
    return profile.gestationalAgeWeeks > contact.recommendedWeek + 2;
  });
  if (missedANC) flags.push('missed_anc');

  const daysSinceRegistration = Math.floor(
    (Date.now() - new Date(profile.registeredAt).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    kebele: profile.kebele,
    gestationalAgeWeeks: profile.gestationalAgeWeeks,
    riskLevel: profile.riskLevel,
    riskFactors: profile.riskFactors,
    lastSeen: Math.max(1, daysSinceRegistration),
    flags,
    ancCompleted,
  };
}

const FLAG_PRIORITY: Record<string, number> = {
  danger_sign: 0,
  missed_anc: 1,
  nutrition_concern: 2,
  wellness_concern: 3,
};

export function sortMothersByPriority(mothers: DemoMother[]): DemoMother[] {
  return [...mothers].sort((a, b) => {
    const aPriority = a.flags.length
      ? Math.min(...a.flags.map((f) => FLAG_PRIORITY[f] ?? 99))
      : 99;
    const bPriority = b.flags.length
      ? Math.min(...b.flags.map((f) => FLAG_PRIORITY[f] ?? 99))
      : 99;
    if (aPriority !== bPriority) return aPriority - bPriority;
    if (a.riskLevel === 'high' && b.riskLevel !== 'high') return -1;
    if (b.riskLevel === 'high' && a.riskLevel !== 'high') return 1;
    return a.lastSeen - b.lastSeen;
  });
}
