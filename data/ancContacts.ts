import type { ANCContactDef } from '@/lib/types';

export const ANC_CONTACTS: ANCContactDef[] = [
  { id: 1, label: 'ANC 1', recommendedWeek: 12, focus: 'Registration, blood tests, risk assessment (≤12 weeks)' },
  { id: 2, label: 'ANC 2', recommendedWeek: 20, focus: 'Ultrasound, anomaly screening' },
  { id: 3, label: 'ANC 3', recommendedWeek: 26, focus: 'Blood pressure, anemia check' },
  { id: 4, label: 'ANC 4', recommendedWeek: 30, focus: 'Fetal growth assessment' },
  { id: 5, label: 'ANC 5', recommendedWeek: 34, focus: 'Birth preparedness counseling' },
  { id: 6, label: 'ANC 6', recommendedWeek: 36, focus: 'Presentation check, final labs' },
  { id: 7, label: 'ANC 7', recommendedWeek: 38, focus: 'Danger signs review' },
  { id: 8, label: 'ANC 8', recommendedWeek: 40, focus: 'Birth plan confirmation' },
];
