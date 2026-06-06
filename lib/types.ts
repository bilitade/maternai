export type RiskLevel = 'low' | 'monitoring' | 'high';

export type FamilySupport = 'yes' | 'somewhat' | 'no';

export type RegistrationSource = 'self' | 'hew';

export type ANCAlertLevel = 'none' | 'yellow' | 'orange' | 'red';

export type MotherFlag =
  | 'danger_sign'
  | 'missed_anc'
  | 'nutrition_concern'
  | 'wellness_concern';

export type AIAction = 'dangerSigns' | 'nutrition' | 'wellness';

export type UserRole = 'mother' | 'hew';

export interface MotherProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  alternativePhone?: string;
  partnerName?: string;
  partnerPhone?: string;
  region: string;
  zone?: string;
  woreda?: string;
  kebele: string;
  village?: string;
  lmp: string;
  edd?: string;
  gestationalAgeWeeks: number;
  gravidity: number;
  parity: number;
  livingChildren?: number;
  plannedPregnancy?: boolean;
  wantedPregnancy?: boolean;
  multiplePregnancy?: boolean;
  previousCSection: boolean;
  previousStillbirth: boolean;
  hypertension: boolean;
  diabetes: boolean;
  hiv?: boolean;
  anemia?: boolean;
  tb?: boolean;
  familySupport: FamilySupport;
  mealsPerDay: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  registeredAt: string;
  registeredBy: RegistrationSource;
}

export interface NutritionProfile {
  heightCm?: number;
  currentWeightKg?: number;
  muacCm?: number;
  hemoglobin?: number;
  dietaryDiversityScore?: number;
  ironAdherencePct?: number;
  calciumAdherencePct?: number;
  updatedAt?: string;
}

export interface ANCContact {
  id: number;
  completed: boolean;
  completedDate: string | null;
  missed: boolean;
  missedSince: string | null;
}

export interface WellnessEntry {
  date: string;
  score: number;
  answers: number[];
}

export interface RiskResult {
  riskLevel: RiskLevel;
  riskFactors: string[];
  riskScore: number;
}

export interface DemoMother {
  id: string;
  name: string;
  age: number;
  kebele: string;
  gestationalAgeWeeks: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  lastSeen: number;
  flags: MotherFlag[];
  ancCompleted: number[];
  ancAlertLevel?: ANCAlertLevel;
  ancOverdueContact?: number | null;
  ancDaysOverdue?: number;
}

export interface ANCContactDef {
  id: number;
  label: string;
  recommendedWeek: number;
  focus: string;
}

export interface Food {
  name: string;
  amharic: string;
  nutrient: 'Iron' | 'Protein' | 'Folate' | 'Energy' | 'Calcium';
  tip: string;
  trimesters: (1 | 2 | 3)[];
}

export interface DangerSign {
  id: string;
  label: string;
  icon: string;
}

export interface AIRequestBody {
  action: AIAction;
  locale?: 'en' | 'am';
  payload: {
    signs?: string[];
    weeks?: number;
    riskFactors?: string[];
    score?: number;
    lowWeeks?: number;
  };
}

export interface AIResponseBody {
  text: string;
  source: 'ai' | 'offline';
}

export type AIInsightType = 'danger' | 'nutrition' | 'wellness';

export interface AIInsight {
  type: AIInsightType;
  text: string;
  source: 'ai' | 'offline';
  date: string;
  meta?: {
    signs?: string[];
    urgent?: boolean;
    score?: number;
  };
}

export interface DangerSignReport {
  id: string;
  date: string;
  signs: string[];
  response: string;
  urgent: boolean;
  source: 'ai' | 'offline';
}

export type AppView =
  | 'splash'
  | 'login'
  | 'signup'
  | 'roleSelect'
  | 'motherOnboarding'
  | 'motherDashboard'
  | 'ancTracker'
  | 'dangerSigns'
  | 'nutrition'
  | 'wellnessCheck'
  | 'deliveryPrep'
  | 'hewDashboard'
  | 'hewMotherDetail';

export interface HEWVisit {
  motherId: string;
  date: string;
}

export type HewActionType =
  | 'visit'
  | 'reminder'
  | 'escalate'
  | 'phone_call'
  | 'trace'
  | 'returned_to_care'
  | 'referral';

export interface HewAction {
  id: string;
  type: HewActionType;
  date: string;
  hewUserId: string;
  notes?: string;
}
