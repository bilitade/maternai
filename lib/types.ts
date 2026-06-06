export type RiskLevel = 'low' | 'monitoring' | 'high';

export type FamilySupport = 'yes' | 'somewhat' | 'no';

export type RegistrationSource = 'self' | 'hew';

export type MotherFlag =
  | 'danger_sign'
  | 'missed_anc'
  | 'nutrition_concern'
  | 'wellness_concern';

export type AIAction = 'dangerSigns' | 'nutrition' | 'wellness';

export interface MotherProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  region: string;
  kebele: string;
  lmp: string;
  gestationalAgeWeeks: number;
  gravidity: number;
  parity: number;
  previousCSection: boolean;
  previousStillbirth: boolean;
  hypertension: boolean;
  diabetes: boolean;
  familySupport: FamilySupport;
  mealsPerDay: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  registeredAt: string;
  registeredBy: RegistrationSource;
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
