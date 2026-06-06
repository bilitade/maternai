'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MotherOnboardingPage from '@/components/views/MotherOnboardingPage';

export default function RegisterClient() {
  const router = useRouter();
  const { update } = useSession();

  return (
    <MotherOnboardingPage
      onComplete={async () => {
        await update();
        router.replace('/dashboard');
      }}
    />
  );
}
