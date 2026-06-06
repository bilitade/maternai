'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import HEWDashboard from '@/components/views/HEWDashboard';
import { clearMaternaStorage } from '@/lib/storage';

export default function HewPageClient() {
  const router = useRouter();

  const handleLogout = async () => {
    clearMaternaStorage();
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <HEWDashboard
      onSelectMother={(mother) => router.push(`/hew/mother/${mother.id}`)}
      onLogout={handleLogout}
    />
  );
}
