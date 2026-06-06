'use client';

import AuthProvider from '@/components/providers/AuthProvider';
import { MotherDataProvider } from '@/components/providers/MotherDataProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <MotherDataProvider>{children}</MotherDataProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
