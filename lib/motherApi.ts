import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  AIInsight,
  DangerSignReport,
  NutritionProfile,
} from './types';

async function readApiError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.error === 'string') return data.error;
  } catch {
    /* ignore */
  }
  return `Request failed (${res.status})`;
}

export async function patchMotherData(
  body: Record<string, unknown>
): Promise<void> {
  const res = await fetch('/api/mother', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readApiError(res));
  }
}

export async function saveProfileToServer(profile: MotherProfile): Promise<void> {
  const res = await fetch('/api/mother', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    throw new Error(await readApiError(res));
  }
}

export async function saveANCContacts(ancContacts: ANCContact[]): Promise<void> {
  await patchMotherData({ ancContacts });
}

export async function saveWellnessHistory(
  wellnessHistory: WellnessEntry[]
): Promise<void> {
  await patchMotherData({ wellnessHistory });
}

export async function saveDeliveryPrepState(
  deliveryPrep: number[]
): Promise<void> {
  await patchMotherData({ deliveryPrep });
}

export async function saveAIInsights(aiInsights: AIInsight[]): Promise<void> {
  await patchMotherData({ aiInsights });
}

export async function saveDangerReports(
  dangerReports: DangerSignReport[]
): Promise<void> {
  await patchMotherData({ dangerReports });
}

export async function saveNutritionProfile(
  nutritionProfile: NutritionProfile
): Promise<void> {
  await patchMotherData({
    nutritionProfile: {
      ...nutritionProfile,
      updatedAt: new Date().toISOString(),
    },
  });
}
