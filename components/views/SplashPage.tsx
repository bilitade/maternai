'use client';

import { useEffect } from 'react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLocale } from '@/components/providers/LocaleProvider';

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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-emerald-700 text-white px-8 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageToggle />
      </div>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-6 md:w-24 md:h-24"
      >
        <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.15)" />
        <path
          d="M40 62s-22-14-22-28a12 12 0 0124 0 12 12 0 0124 0c0 14-26 28-26 28z"
          fill="white"
        />
      </svg>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
        {t('appName')}
      </h1>
      <p className="text-emerald-200 text-lg md:text-xl">{t('tagline')}</p>
      <p className="text-emerald-300 text-sm md:text-base mt-1">
        {t('taglineAmharic')}
      </p>
    </div>
  );
}
