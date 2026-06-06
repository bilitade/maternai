import type { AppView, UserRole } from './types';

/** URL paths for each app view — single source of truth for navigation. */
export const VIEW_PATH: Record<AppView, string> = {
  splash: '/',
  login: '/login',
  signup: '/signup',
  roleSelect: '/role',
  motherOnboarding: '/register',
  motherDashboard: '/dashboard',
  ancTracker: '/dashboard/anc',
  dangerSigns: '/dashboard/danger',
  nutrition: '/dashboard/nutrition',
  wellnessCheck: '/dashboard/wellness',
  deliveryPrep: '/dashboard/delivery',
  hewDashboard: '/hew',
  hewMotherDetail: '/hew/mother',
};

const PUBLIC_VIEWS: AppView[] = ['splash', 'login', 'signup', 'roleSelect'];

const MOTHER_VIEWS: AppView[] = [
  'motherOnboarding',
  'motherDashboard',
  'ancTracker',
  'dangerSigns',
  'nutrition',
  'wellnessCheck',
  'deliveryPrep',
];

const HEW_VIEWS: AppView[] = ['hewDashboard', 'hewMotherDetail'];

export function pathToView(pathname: string): AppView | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  if (normalized.startsWith('/hew/mother/')) return 'hewMotherDetail';

  const entry = Object.entries(VIEW_PATH).find(([, path]) => path === normalized);
  return entry ? (entry[0] as AppView) : null;
}

export function viewToPath(view: AppView, motherId?: string): string {
  if (view === 'hewMotherDetail' && motherId) {
    return `/hew/mother/${motherId}`;
  }
  return VIEW_PATH[view];
}

export function homeForRole(role: UserRole, hasProfile: boolean): string {
  if (role === 'hew') return VIEW_PATH.hewDashboard;
  return hasProfile ? VIEW_PATH.motherDashboard : VIEW_PATH.motherOnboarding;
}

export function isPublicView(view: AppView): boolean {
  return PUBLIC_VIEWS.includes(view);
}

export function isMotherView(view: AppView): boolean {
  return MOTHER_VIEWS.includes(view);
}

export function isHewView(view: AppView): boolean {
  return HEW_VIEWS.includes(view);
}

export function canAccessView(
  view: AppView,
  role: UserRole | undefined,
  hasProfile: boolean
): boolean {
  if (isPublicView(view)) return true;
  if (!role) return false;
  if (isHewView(view)) return role === 'hew';
  if (!isMotherView(view)) return false;
  if (role !== 'mother') return false;
  if (view === 'motherOnboarding') return !hasProfile;
  return hasProfile;
}
