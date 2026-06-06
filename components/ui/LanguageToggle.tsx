'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex rounded-lg overflow-hidden border border-emerald-500/50 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === 'en'
            ? 'bg-white text-emerald-800'
            : 'text-emerald-100 hover:bg-emerald-600'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('am')}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === 'am'
            ? 'bg-white text-emerald-800'
            : 'text-emerald-100 hover:bg-emerald-600'
        }`}
      >
        አማ
      </button>
    </div>
  );
}
