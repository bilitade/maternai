'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignupPage from '@/components/views/SignupPage';
import { homeForRole } from '@/lib/routes';

export default function SignupClient() {
  const router = useRouter();
  const { update } = useSession();

  const onSuccess = async () => {
    const s = await update();
    if (s?.user) {
      router.replace(homeForRole(s.user.role, s.user.hasProfile ?? false));
    }
  };

  return (
    <SignupPage
      onSuccess={onSuccess}
      onGoLogin={() => router.push('/login')}
    />
  );
}
