import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import type { HewAction, HewActionType } from '@/lib/types';

const VALID_TYPES: HewActionType[] = [
  'visit',
  'reminder',
  'escalate',
  'phone_call',
  'trace',
  'returned_to_care',
  'referral',
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ motherId: string }> }
) {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'hew') {
    return NextResponse.json({ error: 'HEW access only' }, { status: 403 });
  }

  const { motherId } = await params;
  const body = await req.json();
  const type = body.type as HewActionType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }

  const db = getDb();
  const [profileRow] = await db
    .select()
    .from(motherProfiles)
    .where(eq(motherProfiles.id, motherId))
    .limit(1);

  if (!profileRow) {
    return NextResponse.json({ error: 'Mother not found' }, { status: 404 });
  }

  const action: HewAction = {
    id: crypto.randomUUID(),
    type,
    date: new Date().toISOString(),
    hewUserId: session!.user.id,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
  };

  const [dataRow] = await db
    .select()
    .from(motherData)
    .where(eq(motherData.userId, profileRow.userId))
    .limit(1);

  const existing = (dataRow?.hewActions as HewAction[]) ?? [];
  const hewActions = [...existing, action];

  if (dataRow) {
    await db
      .update(motherData)
      .set({ hewActions, updatedAt: new Date() })
      .where(eq(motherData.userId, profileRow.userId));
  } else {
    await db.insert(motherData).values({
      userId: profileRow.userId,
      hewActions,
    });
  }

  return NextResponse.json({ ok: true, action });
}
