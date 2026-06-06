'use client';

import type { AppView } from '@/lib/types';
import PageContainer from './PageContainer';
import WebHeader from './WebHeader';
import MotherSidebar from './MotherSidebar';
import MotherNavBar from './MotherNavBar';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  currentView: AppView;
  navigate: (view: AppView) => void;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export default function MotherLayout({
  currentView,
  navigate,
  title,
  subtitle,
  onBack,
  backLabel,
  headerActions,
  children,
  contentClassName,
}: Props) {
  const { t } = useLocale();
  const isDashboard = currentView === 'motherDashboard';

  return (
    <div className="flex flex-col min-h-screen w-full">
      <WebHeader
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        backLabel={backLabel ?? t('dashboard')}
        actions={headerActions}
        showBrand={isDashboard}
      />
      <PageContainer className="py-6 lg:py-8 flex-1">
        <MotherNavBar currentView={currentView} navigate={navigate} />
        <div className="flex gap-8 lg:gap-10">
          <MotherSidebar currentView={currentView} navigate={navigate} />
          <main className={`flex-1 min-w-0 ${contentClassName ?? ''}`}>
            {children}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}
