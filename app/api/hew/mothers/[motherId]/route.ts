import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import {
  buildDemoMother,
  parseMotherDataRow,
} from '@/lib/motherServer';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ motherId: string }> }
) {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'hew') {
    return NextResponse.json({ error: 'HEW access only' }, { status: 403 });
  }

  const { motherId } = await params;
  const db = getDb();

  const [profileRow] = await db
    .select()
    .from(motherProfiles)
    .where(eq(motherProfiles.id, motherId))
    .limit(1);

  if (!profileRow) {
    return NextResponse.json({ error: 'Mother not found' }, { status: 404 });
  }

  const [dataRow] = await db
    .select()
    .from(motherData)
    .where(eq(motherData.userId, profileRow.userId))
    .limit(1);

  const data = parseMotherDataRow(profileRow, dataRow);
  const summary = buildDemoMother(profileRow, dataRow);

  return NextResponse.json({ summary, ...data });
}
