import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  DangerSignReport,
  DemoMother,
  AIInsight,
  HewAction,
  NutritionProfile,
} from './types';
import { getHighestANCAlert } from './ancLogic';
import { rowToProfile } from './profileMapper';
import { calcGestationalWeeks } from './riskLogic';
import { calcNutritionScore, muacStatus } from './nutritionLogic';
import type { motherProfiles, motherData } from '@/lib/db/schema';

export { rowToProfile } from './profileMapper';

export function buildDemoMother(
  profile: typeof motherProfiles.$inferSelect,
  data: typeof motherData.$inferSelect | undefined
): DemoMother {
  const liveWeeks = profile.lmp
    ? calcGestationalWeeks(profile.lmp)
    : profile.gestationalAgeWeeks;

  const ancContacts = (data?.ancContacts as ANCContact[]) ?? [];
  const ancCompleted = ancContacts.filter((c) => c.completed).map((c) => c.id);
  const wellnessHistory = (data?.wellnessHistory as WellnessEntry[]) ?? [];
  const dangerReports = (data?.dangerReports as DangerSignReport[]) ?? [];
  const nutritionProfile = (data?.nutritionProfile as NutritionProfile) ?? {};
  const latestDanger = dangerReports[dangerReports.length - 1];

  const flags: DemoMother['flags'] = [];
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  if (
    latestDanger?.signs.length &&
    Date.now() - new Date(latestDanger.date).getTime() < sevenDays
  ) {
    flags.push('danger_sign');
  }
  if (wellnessHistory.slice(-3).some((e) => e.score < 40)) {
    flags.push('wellness_concern');
  }

  const nutritionScore = calcNutritionScore(nutritionProfile);
  const muacRisk = muacStatus(nutritionProfile.muacCm) === 'malnutrition';
  if (
    profile.mealsPerDay < 2 ||
    profile.anemia ||
    muacRisk ||
    (nutritionScore !== null && nutritionScore < 40)
  ) {
    flags.push('nutrition_concern');
  }

  const ancAlert = profile.lmp
    ? getHighestANCAlert(profile.lmp, ancContacts)
    : { level: 'none' as const, contactId: null, daysOverdue: 0 };

  if (ancAlert.level !== 'none') {
    flags.push('missed_anc');
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(profile.registeredAt).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    kebele: profile.kebele,
    gestationalAgeWeeks: liveWeeks,
    riskLevel: profile.riskLevel as DemoMother['riskLevel'],
    riskFactors: profile.riskFactors ?? [],
    lastSeen: Math.max(1, daysSince),
    flags,
    ancCompleted,
    ancAlertLevel: ancAlert.level,
    ancOverdueContact: ancAlert.contactId,
    ancDaysOverdue: ancAlert.daysOverdue,
  };
}

export interface MotherDataPayload {
  profile: MotherProfile | null;
  ancContacts: ANCContact[];
  wellnessHistory: WellnessEntry[];
  deliveryPrep: number[];
  aiInsights: AIInsight[];
  dangerReports: DangerSignReport[];
  nutritionProfile: NutritionProfile;
  hewActions: HewAction[];
}

export function parseMotherDataRow(
  profileRow: typeof motherProfiles.$inferSelect | undefined,
  dataRow: typeof motherData.$inferSelect | undefined
): MotherDataPayload {
  return {
    profile: profileRow ? rowToProfile(profileRow) : null,
    ancContacts: (dataRow?.ancContacts as ANCContact[]) ?? [],
    wellnessHistory: (dataRow?.wellnessHistory as WellnessEntry[]) ?? [],
    deliveryPrep: (dataRow?.deliveryPrep as number[]) ?? [],
    aiInsights: (dataRow?.aiInsights as AIInsight[]) ?? [],
    dangerReports: (dataRow?.dangerReports as DangerSignReport[]) ?? [],
    nutritionProfile: (dataRow?.nutritionProfile as NutritionProfile) ?? {},
    hewActions: (dataRow?.hewActions as HewAction[]) ?? [],
  };
}

const FLAG_PRIORITY: Record<string, number> = {
  danger_sign: 0,
  missed_anc: 1,
  nutrition_concern: 2,
  wellness_concern: 3,
};

const ALERT_RANK = { none: 0, yellow: 1, orange: 2, red: 3 };

export function sortMothersByPriority(mothers: DemoMother[]): DemoMother[] {
  return [...mothers].sort((a, b) => {
    const aAlert = ALERT_RANK[a.ancAlertLevel ?? 'none'];
    const bAlert = ALERT_RANK[b.ancAlertLevel ?? 'none'];
    if (aAlert !== bAlert) return bAlert - aAlert;

    const aP = a.flags.length
      ? Math.min(...a.flags.map((f) => FLAG_PRIORITY[f] ?? 99))
      : 99;
    const bP = b.flags.length
      ? Math.min(...b.flags.map((f) => FLAG_PRIORITY[f] ?? 99))
      : 99;
    if (aP !== bP) return aP - bP;
    if (a.riskLevel === 'high' && b.riskLevel !== 'high') return -1;
    if (b.riskLevel === 'high' && a.riskLevel !== 'high') return 1;
    return a.lastSeen - b.lastSeen;
  });
}
