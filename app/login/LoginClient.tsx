'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginPage from '@/components/views/LoginPage';
import { homeForRole } from '@/lib/routes';

export default function LoginClient() {
  const router = useRouter();
  const { update } = useSession();

  const onSuccess = async () => {
    const s = await update();
    if (s?.user) {
      router.replace(homeForRole(s.user.role, s.user.hasProfile ?? false));
    }
  };

  return (
    <LoginPage
      onSuccess={onSuccess}
      onGoSignup={() => router.push('/signup')}
    />
  );
}
