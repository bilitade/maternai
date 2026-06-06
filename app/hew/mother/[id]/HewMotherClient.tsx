'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { use } from 'react';
import HEWMotherDetailPage from '@/components/views/HEWMotherDetailPage';
import { clearMaternaStorage } from '@/lib/storage';

export default function HewMotherClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const handleLogout = async () => {
    clearMaternaStorage();
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <HEWMotherDetailPage
      motherId={id}
      onBack={() => router.push('/hew')}
      onLogout={handleLogout}
    />
  );
}
