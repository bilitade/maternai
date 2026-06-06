'use client';

import { ChevronLeft } from 'lucide-react';
import PageContainer from './PageContainer';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';
import { cn } from '@/lib/cn';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
  showBrand?: boolean;
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill="#ccfbf1" />
      <path
        d="M40 62s-22-14-22-28a12 12 0 0124 0 12 12 0 0124 0c0 14-26 28-26 28z"
        fill="#0d9488"
      />
    </svg>
  );
}

export default function WebHeader({
  title,
  subtitle,
  onBack,
  backLabel,
  actions,
  showBrand = false,
}: Props) {
  const { t } = useLocale();

  return (
    <header className={ds.header}>
      <PageContainer className="py-4 lg:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className={ds.headerBack}
                type="button"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">{backLabel ?? t('back')}</span>
              </button>
            )}
            {showBrand && !onBack && (
              <div className="hidden md:flex items-center gap-2.5 pr-4 border-r border-slate-200 mr-1 shrink-0">
                <BrandMark />
                <span className={ds.headerBrand}>{t('appName')}</span>
              </div>
            )}
            {!showBrand && !onBack && <BrandMark className="hidden sm:block shrink-0" />}
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-slate-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className={cn(ds.headerSubtitle, 'mt-0.5')}>{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
            <LanguageToggle />
            {actions}
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
