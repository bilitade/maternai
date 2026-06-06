'use client';

import type { AppView } from '@/lib/types';
import PageContainer from './PageContainer';
import WebHeader from './WebHeader';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  navigate: (view: AppView) => void;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export default function HEWLayout({
  navigate,
  title,
  subtitle,
  onBack,
  backLabel,
  headerActions,
  children,
}: Props) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <WebHeader
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        backLabel={backLabel ?? t('dashboard')}
        showBrand={!onBack}
        actions={
          headerActions ?? (
            <button
              onClick={() => navigate('roleSelect')}
              className="text-sm text-emerald-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-600"
            >
              {t('switchRole')}
            </button>
          )
        }
      />
      <PageContainer className="py-6 lg:py-8 flex-1">{children}</PageContainer>
    </div>
  );
}
