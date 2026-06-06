import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { UserRole } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? '')
      .toLowerCase()
      .trim();
    const password = String(body.password ?? '');
    const name = String(body.name ?? '').trim();
    const role = body.role as UserRole;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email and password (min 6 chars) required' },
        { status: 400 }
      );
    }
    if (role !== 'mother' && role !== 'hew') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const db = getDb();
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || null,
        role,
      })
      .returning({ id: users.id, email: users.email, role: users.role });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
