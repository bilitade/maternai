'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import SplashPage from '@/components/views/SplashPage';
import { homeForRole } from '@/lib/routes';

export default function SplashClient() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const onDone = useCallback(() => {
    if (status === 'authenticated' && session?.user) {
      router.replace(
        homeForRole(session.user.role, session.user.hasProfile ?? false)
      );
    } else {
      router.replace('/login');
    }
  }, [status, session, router]);

  return <SplashPage onDone={onDone} />;
}
