'use client';

import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import PageContainer from '@/components/layout/PageContainer';
import WebHeader from '@/components/layout/WebHeader';
import MotherSidebar from '@/components/layout/MotherSidebar';
import MotherNavBar from '@/components/layout/MotherNavBar';
import { useMotherPageContext } from '@/components/providers/MotherPageProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { clearMaternaStorage } from '@/lib/storage';
import { ds } from '@/lib/design-system';

export default function MotherShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t } = useLocale();
  const { header } = useMotherPageContext();

  const handleLogout = async () => {
    clearMaternaStorage();
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className={ds.page}>
      <WebHeader
        title={header.title}
        subtitle={header.subtitle}
        backHref={header.backHref}
        backLabel={header.backLabel ?? t('dashboard')}
        showBrand={!header.backHref}
        actions={
          <button type="button" onClick={handleLogout} className={ds.headerAction}>
            Sign out
          </button>
        }
      />
      <PageContainer className="py-6 lg:py-10 flex-1">
        <MotherNavBar />
        <div className="flex gap-8 lg:gap-10">
          <MotherSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </PageContainer>
    </div>
  );
}
