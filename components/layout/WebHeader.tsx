'use client';

import { ChevronLeft } from 'lucide-react';
import PageContainer from './PageContainer';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
  showBrand?: boolean;
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
    <header className="bg-emerald-700 text-white w-full border-b border-emerald-800/30">
      <PageContainer className="py-4 lg:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 p-2 -ml-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm shrink-0"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">{backLabel ?? t('back')}</span>
              </button>
            )}
            {showBrand && !onBack && (
              <div className="hidden md:flex items-center gap-2 pr-4 border-r border-emerald-600 mr-2 shrink-0">
                <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.15)" />
                  <path
                    d="M40 62s-22-14-22-28a12 12 0 0124 0 12 12 0 0124 0c0 14-26 28-26 28z"
                    fill="white"
                  />
                </svg>
                <span className="font-semibold text-sm">{t('appName')}</span>
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold truncate">{title}</h1>
              {subtitle && (
                <p className="text-emerald-200 text-sm mt-0.5">{subtitle}</p>
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
