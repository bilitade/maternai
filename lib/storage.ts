import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  HEWVisit,
} from './types';

const KEYS = {
  PROFILE: 'materna_mother_profile',
  ANC: 'materna_anc_contacts',
  WELLNESS: 'materna_wellness_history',
  DELIVERY_PREP: 'materna_delivery_prep',
  HEW_VISITS: 'materna_hew_visits',
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
