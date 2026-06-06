import { messagesAm, messagesEn, type MessageKey } from './i18n/messages';

export type Locale = 'en' | 'am';

export const LOCALE_STORAGE_KEY = 'materna_locale';

export type { MessageKey };

const messages = { en: messagesEn, am: messagesAm };

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key];
}

export function tf(
  locale: Locale,
  key: MessageKey,
  vars: Record<string, string | number>
): string {
  let text = t(locale, key);
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, String(v));
  }
  return text;
}
