'use client';

import { useEffect } from 'react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

interface Props {
  onDone: () => void;
}

export default function SplashPage({ onDone }: Props) {
  const { t } = useLocale();

  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={ds.splash + ' relative'}>
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
        <LanguageToggle />
      </div>
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-100 flex items-center justify-center mb-8 ring-4 ring-teal-50 shadow-sm">
        <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 62s-22-14-22-28a12 12 0 0124 0 12 12 0 0124 0c0 14-26 28-26 28z"
            fill="#0d9488"
          />
        </svg>
      </div>
      <h1 className={ds.splashTitle}>{t('appName')}</h1>
      <p className={ds.splashTagline + ' mt-2'}>{t('tagline')}</p>
      <p className={ds.splashTaglineAlt}>{t('taglineAmharic')}</p>
    </div>
  );
}
