'use client';

import type { AppView } from '@/lib/types';
import PageContainer from './PageContainer';
import WebHeader from './WebHeader';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

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
    <div className={ds.page}>
      <WebHeader
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        backLabel={backLabel ?? t('dashboard')}
        showBrand={!onBack}
        actions={
          headerActions ?? (
            <button
              type="button"
              onClick={() => navigate('roleSelect')}
              className={ds.headerAction}
            >
              {t('switchRole')}
            </button>
          )
        }
      />
      <PageContainer className="py-6 lg:py-10 flex-1">{children}</PageContainer>
    </div>
  );
}
