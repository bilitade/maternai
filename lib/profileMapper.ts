import type { MotherProfile } from './types';
import { calcEDD } from './ancLogic';
import { calcGestationalWeeks } from './riskLogic';
import type { motherProfiles } from '@/lib/db/schema';

export function rowToProfile(
  row: typeof motherProfiles.$inferSelect
): MotherProfile {
  const profile: MotherProfile = {
    id: row.id,
    name: row.name,
    age: row.age,
    phone: row.phone,
    alternativePhone: row.alternativePhone ?? undefined,
    partnerName: row.partnerName ?? undefined,
    partnerPhone: row.partnerPhone ?? undefined,
    region: row.region,
    zone: row.zone ?? undefined,
    woreda: row.woreda ?? undefined,
    kebele: row.kebele,
    village: row.village ?? undefined,
    lmp: row.lmp,
    edd: row.edd ?? undefined,
    gestationalAgeWeeks: row.gestationalAgeWeeks,
    gravidity: row.gravidity,
    parity: row.parity,
    livingChildren: row.livingChildren ?? undefined,
    plannedPregnancy: row.plannedPregnancy ?? undefined,
    wantedPregnancy: row.wantedPregnancy ?? undefined,
    multiplePregnancy: row.multiplePregnancy ?? false,
    previousCSection: row.previousCSection,
    previousStillbirth: row.previousStillbirth,
    hypertension: row.hypertension,
    diabetes: row.diabetes,
    hiv: row.hiv ?? false,
    anemia: row.anemia ?? false,
    tb: row.tb ?? false,
    familySupport: row.familySupport as MotherProfile['familySupport'],
    mealsPerDay: row.mealsPerDay,
    riskLevel: row.riskLevel as MotherProfile['riskLevel'],
    riskFactors: row.riskFactors ?? [],
    registeredAt: row.registeredAt?.toISOString() ?? new Date().toISOString(),
    registeredBy: row.registeredBy as MotherProfile['registeredBy'],
  };

  if (profile.lmp) {
    profile.gestationalAgeWeeks = calcGestationalWeeks(profile.lmp);
    profile.edd = profile.edd ?? calcEDD(profile.lmp);
  }

  return profile;
}

export function profileToDbValues(profile: MotherProfile, userId: string) {
  const edd = profile.lmp ? calcEDD(profile.lmp) : profile.edd;
  return {
    id: profile.id,
    userId,
    name: profile.name,
    age: profile.age,
    phone: profile.phone,
    alternativePhone: profile.alternativePhone ?? null,
    partnerName: profile.partnerName ?? null,
    partnerPhone: profile.partnerPhone ?? null,
    region: profile.region,
    zone: profile.zone ?? null,
    woreda: profile.woreda ?? null,
    kebele: profile.kebele,
    village: profile.village ?? null,
    lmp: profile.lmp,
    edd: edd ?? null,
    gestationalAgeWeeks: profile.gestationalAgeWeeks,
    gravidity: profile.gravidity,
    parity: profile.parity,
    livingChildren: profile.livingChildren ?? 0,
    plannedPregnancy: profile.plannedPregnancy ?? null,
    wantedPregnancy: profile.wantedPregnancy ?? null,
    multiplePregnancy: profile.multiplePregnancy ?? false,
    previousCSection: profile.previousCSection,
    previousStillbirth: profile.previousStillbirth,
    hypertension: profile.hypertension,
    diabetes: profile.diabetes,
    hiv: profile.hiv ?? false,
    anemia: profile.anemia ?? false,
    tb: profile.tb ?? false,
    familySupport: profile.familySupport,
    mealsPerDay: profile.mealsPerDay,
    riskLevel: profile.riskLevel,
    riskFactors: profile.riskFactors,
    registeredAt: new Date(profile.registeredAt),
    registeredBy: profile.registeredBy,
  };
}

export function profileToDbUpdate(profile: MotherProfile) {
  const edd = profile.lmp ? calcEDD(profile.lmp) : profile.edd;
  return {
    name: profile.name,
    age: profile.age,
    phone: profile.phone,
    alternativePhone: profile.alternativePhone ?? null,
    partnerName: profile.partnerName ?? null,
    partnerPhone: profile.partnerPhone ?? null,
    region: profile.region,
    zone: profile.zone ?? null,
    woreda: profile.woreda ?? null,
    kebele: profile.kebele,
    village: profile.village ?? null,
    lmp: profile.lmp,
    edd: edd ?? null,
    gestationalAgeWeeks: profile.gestationalAgeWeeks,
    gravidity: profile.gravidity,
    parity: profile.parity,
    livingChildren: profile.livingChildren ?? 0,
    plannedPregnancy: profile.plannedPregnancy ?? null,
    wantedPregnancy: profile.wantedPregnancy ?? null,
    multiplePregnancy: profile.multiplePregnancy ?? false,
    previousCSection: profile.previousCSection,
    previousStillbirth: profile.previousStillbirth,
    hypertension: profile.hypertension,
    diabetes: profile.diabetes,
    hiv: profile.hiv ?? false,
    anemia: profile.anemia ?? false,
    tb: profile.tb ?? false,
    familySupport: profile.familySupport,
    mealsPerDay: profile.mealsPerDay,
    riskLevel: profile.riskLevel,
    riskFactors: profile.riskFactors,
    updatedAt: new Date(),
  };
}
