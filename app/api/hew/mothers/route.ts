import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import type {
  ANCContact,
  WellnessEntry,
  DangerSignReport,
  DemoMother,
} from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { SAMPLE_MOTHERS } from '@/data/sampleMothers';

function buildDemoMother(
  profile: typeof motherProfiles.$inferSelect,
  data: typeof motherData.$inferSelect | undefined
): DemoMother {
  const ancContacts = (data?.ancContacts as ANCContact[]) ?? [];
  const ancCompleted = ancContacts.filter((c) => c.completed).map((c) => c.id);
  const wellnessHistory = (data?.wellnessHistory as WellnessEntry[]) ?? [];
  const dangerReports = (data?.dangerReports as DangerSignReport[]) ?? [];
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
  if (profile.mealsPerDay < 2) flags.push('nutrition_concern');

  const missedANC = ANC_CONTACTS.some((contact) => {
    const saved = ancContacts.find((c) => c.id === contact.id);
    if (saved?.completed) return false;
    return profile.gestationalAgeWeeks > contact.recommendedWeek + 2;
  });
  if (missedANC) flags.push('missed_anc');

  const daysSince = Math.floor(
    (Date.now() - new Date(profile.registeredAt).getTime()) / (24 * 60 * 60 * 1000)
  );

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    kebele: profile.kebele,
    gestationalAgeWeeks: profile.gestationalAgeWeeks,
    riskLevel: profile.riskLevel as DemoMother['riskLevel'],
    riskFactors: profile.riskFactors ?? [],
    lastSeen: Math.max(1, daysSince),
    flags,
    ancCompleted,
  };
}

const FLAG_PRIORITY: Record<string, number> = {
  danger_sign: 0,
  missed_anc: 1,
  nutrition_concern: 2,
  wellness_concern: 3,
};

function sortByPriority(mothers: DemoMother[]): DemoMother[] {
  return [...mothers].sort((a, b) => {
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

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'hew') {
    return NextResponse.json({ error: 'HEW access only' }, { status: 403 });
  }

  const db = getDb();
  const profiles = await db.select().from(motherProfiles);
  const dataRows = await db.select().from(motherData);
  const dataByUserId = new Map(dataRows.map((d) => [d.userId, d]));

  const registered = profiles.map((p) =>
    buildDemoMother(p, dataByUserId.get(p.userId))
  );

  const mothers = sortByPriority([
    ...registered,
    ...SAMPLE_MOTHERS.filter((m) => !registered.some((r) => r.id === m.id)),
  ]);

  return NextResponse.json({ mothers });
}
