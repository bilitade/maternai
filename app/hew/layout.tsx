'use client';

import { Suspense, type ReactNode } from 'react';
import { HewAuthGuard } from '@/components/auth/AuthGuards';
import PageLoading from '@/components/ui/PageLoading';

export default function HewLayout({ children }: { children: ReactNode }) {
  return (
    <HewAuthGuard>
      <Suspense fallback={<PageLoading message="Loading..." />}>
        {children}
      </Suspense>
    </HewAuthGuard>
  );
}
