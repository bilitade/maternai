/**
 * MaternaAI design system — semantic Tailwind class bundles.
 * Palette: soft teal brand on slate neutrals (light, clinical, calm).
 */

export const ds = {
  /** Page & layout */
  page: 'min-h-screen w-full bg-slate-50 text-slate-900',
  pageMuted: 'bg-slate-50',

  /** Surfaces */
  card: 'bg-white border border-slate-200/80 rounded-2xl shadow-sm',
  cardHover: 'hover:shadow-md hover:border-slate-200 transition-all duration-200',
  cardPadding: 'p-5 lg:p-6',

  /** Header — light, not saturated bar */
  header:
    'bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 w-full',
  headerSubtitle: 'text-slate-500 text-sm mt-0.5',
  headerBack:
    'flex items-center gap-1 p-2 -ml-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors text-sm shrink-0',
  headerBrand: 'font-semibold text-sm text-teal-800',
  headerAction:
    'text-sm text-slate-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-teal-50',

  /** Buttons */
  btnPrimary:
    'inline-flex items-center justify-center gap-2 bg-teal-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-teal-600/10',
  btnPrimaryFull: 'w-full',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors',
  btnSecondaryFull: 'w-full',
  btnDanger:
    'inline-flex items-center justify-center gap-2 bg-rose-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-rose-600/10',
  btnDangerFull: 'w-full',

  /** Forms */
  label: 'text-sm font-medium text-slate-700',
  input:
    'mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-shadow',
  select:
    'mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-shadow',

  /** Nav */
  navActive: 'bg-teal-600 text-white shadow-sm shadow-teal-600/15',
  navInactive:
    'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200',
  navPillActive: 'bg-teal-600 text-white shadow-sm',
  navPillInactive:
    'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300',

  /** Brand accents */
  brandIcon: 'text-teal-600 bg-teal-50',
  brandText: 'text-teal-700',
  brandMuted: 'text-teal-600/80',

  /** Section title */
  sectionLabel:
    'text-xs font-semibold text-slate-400 uppercase tracking-wider',

  /** Splash */
  splash:
    'flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-teal-50 via-white to-slate-50 text-slate-900 px-8',
  splashTitle: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900',
  splashTagline: 'text-lg md:text-xl text-slate-600',
  splashTaglineAlt: 'text-sm md:text-base text-teal-700/80 mt-1',

  /** Progress */
  progressTrack: 'h-2 bg-slate-100 rounded-full overflow-hidden',
  progressFill: 'h-full bg-teal-500 rounded-full transition-all duration-300',

  /** Chart */
  chartPrimary: '#14b8a6',

  /** Alerts & feedback */
  alertSuccess: 'bg-teal-50 border border-teal-200/80 rounded-2xl p-5',
  alertSuccessText: 'text-sm text-teal-800 leading-relaxed',
  alertInfo: 'bg-sky-50 border border-sky-200/80 rounded-2xl p-5',
  alertInfoText: 'text-sm text-sky-800 leading-relaxed',
  alertWarning: 'bg-amber-50 border border-amber-200/80 rounded-2xl p-5',
  alertDanger: 'bg-rose-50 border border-rose-200/80 rounded-2xl p-5',
  alertDangerText: 'text-sm text-rose-800 leading-relaxed',

  /** Selection chips */
  chipSelected: 'border-teal-500 bg-teal-50 ring-1 ring-teal-100',
  chipDefault: 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300',
  checklistDone: 'bg-teal-50 border-teal-200/80',
  checklistCheck: 'bg-teal-600 border-teal-600 text-white',
} as const;

export const featureIconColors: Record<string, string> = {
  anc: 'text-teal-600 bg-teal-50 ring-1 ring-teal-100',
  danger: 'text-rose-600 bg-rose-50 ring-1 ring-rose-100',
  nutrition: 'text-amber-600 bg-amber-50 ring-1 ring-amber-100',
  wellness: 'text-violet-600 bg-violet-50 ring-1 ring-violet-100',
  delivery: 'text-sky-600 bg-sky-50 ring-1 ring-sky-100',
  default: 'text-teal-600 bg-teal-50 ring-1 ring-teal-100',
};
