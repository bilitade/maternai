import { Suspense, type ReactNode } from 'react';
import MotherAuthGuard from '@/components/auth/AuthGuards';
import MotherGate from '@/components/layout/MotherGate';
import MotherShell from '@/components/layout/MotherShell';
import { MotherPageProvider } from '@/components/providers/MotherPageProvider';
import PageLoading from '@/components/ui/PageLoading';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <MotherAuthGuard>
      <MotherGate>
        <MotherPageProvider>
          <MotherShell>
            <Suspense fallback={<PageLoading message="Loading page..." />}>
              {children}
            </Suspense>
          </MotherShell>
        </MotherPageProvider>
      </MotherGate>
    </MotherAuthGuard>
  );
}
