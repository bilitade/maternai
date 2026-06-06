import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireSession } from '@/lib/apiAuth';
import { getDb } from '@/lib/db';
import { motherProfiles, motherData } from '@/lib/db/schema';
import type { MotherProfile } from '@/lib/types';
import {
  parseMotherDataRow,
} from '@/lib/motherServer';
import {
  profileToDbUpdate,
  profileToDbValues,
} from '@/lib/profileMapper';

/** GET — load mother profile + synced data for logged-in user */
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'mother') {
    return NextResponse.json({ error: 'Mothers only' }, { status: 403 });
  }

  const db = getDb();
  const userId = session!.user.id;

  try {
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

    const payload = parseMotherDataRow(profileRow, dataRow);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('GET /api/mother failed:', err);
    return NextResponse.json(
      { error: 'Could not load data. Please check your connection and try again.' },
      { status: 503 }
    );
  }
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

  try {
    await db
      .insert(motherProfiles)
      .values(profileToDbValues(profile, userId))
      .onConflictDoUpdate({
        target: motherProfiles.userId,
        set: profileToDbUpdate(profile),
      });

    await db
      .insert(motherData)
      .values({ userId })
      .onConflictDoNothing();
  } catch (err) {
    console.error('PUT /api/mother failed:', err);
    return NextResponse.json(
      { error: 'Could not save profile. Please check your connection and try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}

/** PATCH — sync activity data (ANC, wellness, AI, etc.) */
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;
  if (session!.user.role !== 'mother') {
    return NextResponse.json({ error: 'Mothers only' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const db = getDb();
  const userId = session!.user.id;

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.ancContacts !== undefined) patch.ancContacts = body.ancContacts;
  if (body.wellnessHistory !== undefined) patch.wellnessHistory = body.wellnessHistory;
  if (body.deliveryPrep !== undefined) patch.deliveryPrep = body.deliveryPrep;
  if (body.aiInsights !== undefined) patch.aiInsights = body.aiInsights;
  if (body.dangerReports !== undefined) patch.dangerReports = body.dangerReports;
  if (body.nutritionProfile !== undefined) patch.nutritionProfile = body.nutritionProfile;

  try {
    await db
      .insert(motherData)
      .values({ userId })
      .onConflictDoUpdate({
        target: motherData.userId,
        set: patch,
      });
  } catch (err) {
    console.error('PATCH /api/mother failed:', err);
    return NextResponse.json(
      { error: 'Could not save data. Please check your connection and try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
