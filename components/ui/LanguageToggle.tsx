'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';
import { cn } from '@/lib/cn';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 text-xs font-medium p-0.5"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={cn(
          'px-2.5 py-1.5 rounded-lg transition-colors',
          locale === 'en'
            ? 'bg-white text-teal-800 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('am')}
        className={cn(
          'px-2.5 py-1.5 rounded-lg transition-colors',
          locale === 'am'
            ? 'bg-white text-teal-800 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        )}
      >
        አማ
      </button>
    </div>
  );
}
