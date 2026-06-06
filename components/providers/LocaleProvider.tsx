'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import {
  type Locale,
  LOCALE_STORAGE_KEY,
  type MessageKey,
  t as translate,
  tf as translateFormat,
} from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  tf: (key: MessageKey, vars: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const localeListeners = new Set<() => void>();

function readLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'am') return saved;
  } catch {
    /* ignore */
  }
  return 'en';
}

function subscribeLocale(onChange: () => void) {
  localeListeners.add(onChange);
  return () => localeListeners.delete(onChange);
}

function notifyLocaleListeners() {
  localeListeners.forEach((listener) => listener());
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    readLocale,
    () => 'en' as Locale
  );

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    notifyLocaleListeners();
  }, []);

  const t = useCallback(
    (key: MessageKey) => translate(locale, key),
    [locale]
  );

  const tf = useCallback(
    (key: MessageKey, vars: Record<string, string | number>) =>
      translateFormat(locale, key, vars),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, tf }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
