'use client';

import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import PageLoading from '@/components/ui/PageLoading';

export default function MotherGate({ children }: { children: React.ReactNode }) {
  const { ready, loading } = useMotherData();
  const { t } = useLocale();

  if (!ready && loading) {
    return <PageLoading message={t('loadingData')} />;
  }

  if (!ready) {
    return <PageLoading message={t('loadingData')} />;
  }

  return <>{children}</>;
}
