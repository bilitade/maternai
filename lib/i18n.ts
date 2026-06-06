export type Locale = 'en' | 'am';

export const LOCALE_STORAGE_KEY = 'materna_locale';

const messages = {
  en: {
    appName: 'MaternaAI',
    tagline: 'No mother left behind.',
    taglineAmharic: 'ማተርናኤአይ · ምንም እናት አትቀር',
    welcomeTitle: 'Welcome to MaternaAI',
    welcomeSubtitle: 'Who are you today?',
    roleMother: 'I am a Mother',
    roleMotherSub: 'Track your pregnancy and wellness',
    roleHew: 'I am a Health Extension Worker',
    roleHewSub: 'Manage and monitor your mothers',
    switchRole: 'Switch role',
    back: 'Back',
    dashboard: 'Dashboard',
    navDashboard: 'Dashboard',
    navAnc: 'ANC Tracker',
    navDanger: 'Danger Signs',
    navNutrition: 'Nutrition Guide',
    navWellness: 'Weekly Check-in',
    navDelivery: 'Delivery Prep',
    welcomeBack: 'Welcome back',
    weekOf: 'Week {weeks} of pregnancy',
    registration: 'Registration',
    registrationSub: 'Create your maternal wellness profile',
    hewDashboard: 'HEW Dashboard',
    hewDashboardSub: 'Priority mothers needing attention',
    crisisHelpline:
      'Helpline: Bethzatha Mental Health (Addis Ababa) +251-11-552-4433',
    aiError:
      'AI service unavailable. Please check your symptoms with a health professional.',
    aiKeyMissing:
      'Add OPENROUTER_API_KEY to enable live AI. Showing protocol-based guidance.',
    dangerDisclaimer:
      'This is not a diagnosis. Always seek care from a trained health professional.',
  },
  am: {
    appName: 'ማተርናኤአይ',
    tagline: 'ምንም እናት አትቀር።',
    taglineAmharic: 'MaternaAI · No mother left behind.',
    welcomeTitle: 'እንኳን ወደ MaternaAI በደህና መጡ',
    welcomeSubtitle: 'ዛሬ ማን ነዎት?',
    roleMother: 'እናት ነኝ',
    roleMotherSub: 'እርግዝናዎን እና ጤናዎን ይከታተሉ',
    roleHew: 'የጤና ቅንጅቶ ሰራተኛ ነኝ',
    roleHewSub: 'እናቶችን ይከታተሉ እና ያስተዳድሩ',
    switchRole: 'ሚና ቀይር',
    back: 'ተመለስ',
    dashboard: 'ዳሽቦርድ',
    navDashboard: 'ዳሽቦርድ',
    navAnc: 'ANC መከታተል',
    navDanger: 'አደገኛ ምልክቶች',
    navNutrition: 'nutrition መመሪያ',
    navWellness: 'ሳምንታዊ መጠይቅ',
    navDelivery: 'Delivery Prep',
    welcomeBack: 'እንኳን ደህና መጡ',
    weekOf: 'የ{weeks}ኛ ሳምንት እርግዝና',
    registration: 'ምዝገባ',
    registrationSub: 'የእናት ጤና መገለጫ ይፍጠሩ',
    hewDashboard: 'HEW ዳሽቦርድ',
    hewDashboardSub: 'ትኩረት የሚፈልጉ እናቶች',
    crisisHelpline: 'خط المساعدة: Bethzatha +251-11-552-4433',
    aiError: 'AI አገልግሎት አልተገኘም።',
    aiKeyMissing: 'OPENROUTER_API_KEY ያክሉ።',
    dangerDisclaimer: 'ይህ diagnosis አይደለም።',
  },
} as const;

export type MessageKey = keyof typeof messages.en;

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
