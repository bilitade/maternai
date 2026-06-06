import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  AIInsight,
  DangerSignReport,
  HEWVisit,
} from '@/lib/types';
import { profileToDemoMother } from '@/lib/hewHelpers';
import { SAMPLE_MOTHERS } from '@/data/sampleMothers';

function rowToProfile(row: typeof motherProfiles.$inferSelect): MotherProfile {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    phone: row.phone,
    region: row.region,
    kebele: row.kebele,
    lmp: row.lmp,
    gestationalAgeWeeks: row.gestationalAgeWeeks,
    gravidity: row.gravidity,
    parity: row.parity,
    previousCSection: row.previousCSection,
    previousStillbirth: row.previousStillbirth,
    hypertension: row.hypertension,
    diabetes: row.diabetes,
    familySupport: row.familySupport as MotherProfile['familySupport'],
    mealsPerDay: row.mealsPerDay,
    riskLevel: row.riskLevel as MotherProfile['riskLevel'],
    riskFactors: row.riskFactors ?? [],
    registeredAt: row.registeredAt?.toISOString() ?? new Date().toISOString(),
    registeredBy: row.registeredBy as MotherProfile['registeredBy'],
  };
}

/** GET — load mother profile + synced data for logged-in user */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const db = getDb();
  const userId = session!.user.id;

  const [profileRow] = await db
    .select()
    .from(motherProfiles)
    .where(eq(motherProfiles.userId, userId))
    .limit(1);

  const [dataRow] = await db
    .select()
    .from(motherData)
    .where(eq(motherData.userId, userId))
    .limit(1);

  return NextResponse.json({
    profile: profileRow ? rowToProfile(profileRow) : null,
    ancContacts: (dataRow?.ancContacts as ANCContact[]) ?? [],
    wellnessHistory: (dataRow?.wellnessHistory as WellnessEntry[]) ?? [],
    deliveryPrep: (dataRow?.deliveryPrep as number[]) ?? [],
    aiInsights: (dataRow?.aiInsights as AIInsight[]) ?? [],
    dangerReports: (dataRow?.dangerReports as DangerSignReport[]) ?? [],
    hewVisits: (dataRow?.hewVisits as HEWVisit[]) ?? [],
  });
}

/** PUT — save profile (onboarding) */
export async function PUT(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'mother') {
    return NextResponse.json({ error: 'Only mothers can save profiles' }, { status: 403 });
  }

  const profile = (await req.json()) as MotherProfile;
  const db = getDb();
  const userId = session!.user.id;

  await db
    .insert(motherProfiles)
    .values({
      id: profile.id,
      userId,
      name: profile.name,
      age: profile.age,
      phone: profile.phone,
      region: profile.region,
      kebele: profile.kebele,
      lmp: profile.lmp,
      gestationalAgeWeeks: profile.gestationalAgeWeeks,
      gravidity: profile.gravidity,
      parity: profile.parity,
      previousCSection: profile.previousCSection,
      previousStillbirth: profile.previousStillbirth,
      hypertension: profile.hypertension,
      diabetes: profile.diabetes,
      familySupport: profile.familySupport,
      mealsPerDay: profile.mealsPerDay,
      riskLevel: profile.riskLevel,
      riskFactors: profile.riskFactors,
      registeredAt: new Date(profile.registeredAt),
      registeredBy: profile.registeredBy,
    })
    .onConflictDoUpdate({
      target: motherProfiles.userId,
      set: {
        name: profile.name,
        age: profile.age,
        phone: profile.phone,
        region: profile.region,
        kebele: profile.kebele,
        lmp: profile.lmp,
        gestationalAgeWeeks: profile.gestationalAgeWeeks,
        gravidity: profile.gravidity,
        parity: profile.parity,
        previousCSection: profile.previousCSection,
        previousStillbirth: profile.previousStillbirth,
        hypertension: profile.hypertension,
        diabetes: profile.diabetes,
        familySupport: profile.familySupport,
        mealsPerDay: profile.mealsPerDay,
        riskLevel: profile.riskLevel,
        riskFactors: profile.riskFactors,
        updatedAt: new Date(),
      },
    });

  await db
    .insert(motherData)
    .values({ userId })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

/** PATCH — sync activity data (ANC, wellness, AI, etc.) */
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const db = getDb();
  const userId = session!.user.id;

  await db
    .insert(motherData)
    .values({ userId })
    .onConflictDoNothing();

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.ancContacts !== undefined) patch.ancContacts = body.ancContacts;
  if (body.wellnessHistory !== undefined) patch.wellnessHistory = body.wellnessHistory;
  if (body.deliveryPrep !== undefined) patch.deliveryPrep = body.deliveryPrep;
  if (body.aiInsights !== undefined) patch.aiInsights = body.aiInsights;
  if (body.dangerReports !== undefined) patch.dangerReports = body.dangerReports;
  if (body.hewVisits !== undefined) patch.hewVisits = body.hewVisits;

  await db.update(motherData).set(patch).where(eq(motherData.userId, userId));

  return NextResponse.json({ ok: true });
}
