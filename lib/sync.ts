import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  AIInsight,
  DangerSignReport,
  HEWVisit,
} from './types';
import {
  getProfile,
  saveProfile,
  getANCContacts,
  getWellnessHistory,
  getDeliveryPrep,
  getAIInsights,
  getDangerSignReports,
  getHEWVisits,
  saveANCContact as saveANCLocal,
  saveWellnessEntry as saveWellnessLocal,
  saveDeliveryPrep as saveDeliveryLocal,
  saveAIInsight as saveAILocal,
  saveDangerSignReport as saveDangerLocal,
  saveHEWVisit as saveHEWLocal,
} from './storage';

const KEYS = {
  PROFILE: 'materna_mother_profile',
  ANC: 'materna_anc_contacts',
  WELLNESS: 'materna_wellness_history',
  DELIVERY_PREP: 'materna_delivery_prep',
  HEW_VISITS: 'materna_hew_visits',
  AI_INSIGHTS: 'materna_ai_insights',
  DANGER_REPORTS: 'materna_danger_reports',
} as const;

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('localStorage write failed');
  }
}

/** Pull server data into localStorage after login */
export async function hydrateFromServer(): Promise<boolean> {
  try {
    const res = await fetch('/api/mother');
    if (!res.ok) return false;
    const data = await res.json();
    if (data.profile) safeSet(KEYS.PROFILE, data.profile);
    if (data.ancContacts) safeSet(KEYS.ANC, data.ancContacts);
    if (data.wellnessHistory) safeSet(KEYS.WELLNESS, data.wellnessHistory);
    if (data.deliveryPrep) safeSet(KEYS.DELIVERY_PREP, data.deliveryPrep);
    if (data.aiInsights) safeSet(KEYS.AI_INSIGHTS, data.aiInsights);
    if (data.dangerReports) safeSet(KEYS.DANGER_REPORTS, data.dangerReports);
    if (data.hewVisits) safeSet(KEYS.HEW_VISITS, data.hewVisits);
    return true;
  } catch {
    return false;
  }
}

async function syncPatch(body: Record<string, unknown>): Promise<void> {
  try {
    await fetch('/api/mother', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    /* offline — localStorage still works */
  }
}

export async function saveProfileToServer(profile: MotherProfile): Promise<void> {
  saveProfile(profile);
  try {
    await fetch('/api/mother', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch {
    /* local only */
  }
}

export function saveANCContactSync(contact: ANCContact): void {
  saveANCLocal(contact);
  syncPatch({ ancContacts: getANCContacts() });
}

export function saveWellnessEntrySync(entry: WellnessEntry): void {
  saveWellnessLocal(entry);
  syncPatch({ wellnessHistory: getWellnessHistory() });
}

export function saveDeliveryPrepSync(checked: number[]): void {
  saveDeliveryLocal(checked);
  syncPatch({ deliveryPrep: checked });
}

export function saveAIInsightSync(insight: AIInsight): void {
  saveAILocal(insight);
  syncPatch({ aiInsights: getAIInsights() });
}

export function saveDangerSignReportSync(report: DangerSignReport): void {
  saveDangerLocal(report);
  syncPatch({ dangerReports: getDangerSignReports() });
}

export function saveHEWVisitSync(visit: HEWVisit): void {
  saveHEWLocal(visit);
  syncPatch({ hewVisits: getHEWVisits() });
}
