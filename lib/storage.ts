import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  HEWVisit,
  AIInsight,
  DangerSignReport,
} from './types';

const KEYS = {
  PROFILE: 'materna_mother_profile',
  ANC: 'materna_anc_contacts',
  WELLNESS: 'materna_wellness_history',
  DELIVERY_PREP: 'materna_delivery_prep',
  HEW_VISITS: 'materna_hew_visits',
  AI_INSIGHTS: 'materna_ai_insights',
  DANGER_REPORTS: 'materna_danger_reports',
} as const;

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('localStorage write failed');
  }
}

export const getProfile = (): MotherProfile | null =>
  safeGet<MotherProfile>(KEYS.PROFILE);

export const saveProfile = (profile: MotherProfile): void =>
  safeSet(KEYS.PROFILE, profile);

export const getANCContacts = (): ANCContact[] =>
  safeGet<ANCContact[]>(KEYS.ANC) ?? [];

export const saveANCContact = (contact: ANCContact): void => {
  const existing = getANCContacts().filter((c) => c.id !== contact.id);
  safeSet(KEYS.ANC, [...existing, contact]);
};

export const getWellnessHistory = (): WellnessEntry[] =>
  safeGet<WellnessEntry[]>(KEYS.WELLNESS) ?? [];

export const saveWellnessEntry = (entry: WellnessEntry): void => {
  const history = getWellnessHistory();
  safeSet(KEYS.WELLNESS, [...history, entry]);
};

export const getDeliveryPrep = (): number[] =>
  safeGet<number[]>(KEYS.DELIVERY_PREP) ?? [];

export const saveDeliveryPrep = (checkedIndexes: number[]): void =>
  safeSet(KEYS.DELIVERY_PREP, checkedIndexes);

export const getHEWVisits = (): HEWVisit[] =>
  safeGet<HEWVisit[]>(KEYS.HEW_VISITS) ?? [];

export const saveHEWVisit = (visit: HEWVisit): void => {
  const visits = getHEWVisits();
  safeSet(KEYS.HEW_VISITS, [...visits, visit]);
};

export const getAIInsights = (): AIInsight[] =>
  safeGet<AIInsight[]>(KEYS.AI_INSIGHTS) ?? [];

export const saveAIInsight = (insight: AIInsight): void => {
  const history = getAIInsights();
  safeSet(KEYS.AI_INSIGHTS, [...history.slice(-19), insight]);
};

export const getLatestAIInsight = (): AIInsight | null => {
  const insights = getAIInsights();
  return insights.length ? insights[insights.length - 1] : null;
};

export const getDangerSignReports = (): DangerSignReport[] =>
  safeGet<DangerSignReport[]>(KEYS.DANGER_REPORTS) ?? [];

export const saveDangerSignReport = (report: DangerSignReport): void => {
  const reports = getDangerSignReports();
  safeSet(KEYS.DANGER_REPORTS, [...reports, report]);
};

export const getLatestDangerReport = (): DangerSignReport | null => {
  const reports = getDangerSignReports();
  return reports.length ? reports[reports.length - 1] : null;
};

const MATERNA_KEYS = [
  'materna_mother_profile',
  'materna_anc_contacts',
  'materna_wellness_history',
  'materna_delivery_prep',
  'materna_hew_visits',
  'materna_ai_insights',
  'materna_danger_reports',
] as const;

export function clearMaternaStorage(): void {
  if (typeof window === 'undefined') return;
  for (const key of MATERNA_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
