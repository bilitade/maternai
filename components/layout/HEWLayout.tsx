'use client';

import PageContainer from './PageContainer';
import WebHeader from './WebHeader';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export default function HEWLayout({
  title,
  subtitle,
  backHref,
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
        backHref={backHref}
        onBack={onBack}
        backLabel={backLabel ?? t('dashboard')}
        showBrand={!backHref && !onBack}
        actions={headerActions}
      />
      <PageContainer className="py-6 lg:py-10 flex-1">{children}</PageContainer>
    </div>
  );
}
