import { Suspense, type ReactNode } from 'react';
import { RegisterAuthGuard } from '@/components/auth/AuthGuards';
import PageLoading from '@/components/ui/PageLoading';

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <RegisterAuthGuard>
      <Suspense fallback={<PageLoading message="Loading..." />}>
        {children}
      </Suspense>
    </RegisterAuthGuard>
  );
}
