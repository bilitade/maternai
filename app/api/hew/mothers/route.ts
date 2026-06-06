import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import {
  buildDemoMother,
  sortMothersByPriority,
} from '@/lib/motherServer';

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

  const mothers = sortMothersByPriority(
    profiles.map((p) => buildDemoMother(p, dataByUserId.get(p.userId)))
  );

  return NextResponse.json({ mothers });
}
