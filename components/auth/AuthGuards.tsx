'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLoading from '@/components/ui/PageLoading';
import { homeForRole } from '@/lib/routes';

interface Props {
  children: React.ReactNode;
}

export default function MotherAuthGuard({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (session?.user?.role !== 'mother') {
      router.replace('/hew');
      return;
    }

    if (!session.user.hasProfile) {
      router.replace('/register');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <PageLoading message="Checking session..." />;
  }

  if (
    status !== 'authenticated' ||
    session?.user?.role !== 'mother' ||
    !session.user.hasProfile
  ) {
    return <PageLoading message="Redirecting..." />;
  }

  return <>{children}</>;
}

export function RegisterAuthGuard({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (session?.user?.role !== 'mother') {
      router.replace(homeForRole(session!.user.role, true));
      return;
    }
    if (session.user.hasProfile) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <PageLoading message="Checking session..." />;
  }

  if (
    status !== 'authenticated' ||
    session?.user?.role !== 'mother' ||
    session.user.hasProfile
  ) {
    return <PageLoading message="Redirecting..." />;
  }

  return <>{children}</>;
}

export function HewAuthGuard({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (session?.user?.role !== 'hew') {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <PageLoading message="Checking session..." />;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'hew') {
    return <PageLoading message="Redirecting..." />;
  }

  return <>{children}</>;
}
