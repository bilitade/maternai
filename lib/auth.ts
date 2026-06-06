import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { users, motherProfiles } from './db/schema';
import type { UserRole } from './types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      hasProfile: boolean;
    };
  }
  interface User {
    role: UserRole;
    hasProfile: boolean;
  }
}

type AuthToken = {
  id?: string;
  role?: UserRole;
  hasProfile?: boolean;
  sub?: string;
  email?: string | null;
  name?: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const db = getDb();
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase().trim()))
          .limit(1);

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        let hasProfile = false;
        if (user.role === 'mother') {
          const [profile] = await db
            .select({ id: motherProfiles.id })
            .from(motherProfiles)
            .where(eq(motherProfiles.userId, user.id))
            .limit(1);
          hasProfile = Boolean(profile);
        } else {
          hasProfile = true;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          hasProfile,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const t = token as AuthToken;
      if (user) {
        t.id = user.id!;
        t.role = user.role;
        t.hasProfile = user.hasProfile;
      }
      if (trigger === 'update' && t.id) {
        const db = getDb();
        const [profile] = await db
          .select({ id: motherProfiles.id })
          .from(motherProfiles)
          .where(eq(motherProfiles.userId, t.id))
          .limit(1);
        t.hasProfile = Boolean(profile);
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as AuthToken;
      session.user.id = t.id as string;
      session.user.role = t.role as UserRole;

      if (t.id && t.role === 'mother') {
        try {
          const db = getDb();
          const [profile] = await db
            .select({ id: motherProfiles.id })
            .from(motherProfiles)
            .where(eq(motherProfiles.userId, t.id))
            .limit(1);
          session.user.hasProfile = Boolean(profile);
          t.hasProfile = Boolean(profile);
        } catch {
          session.user.hasProfile = Boolean(t.hasProfile);
        }
      } else {
        session.user.hasProfile = Boolean(t.hasProfile);
      }

      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
