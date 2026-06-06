import type { AppView } from '@/lib/types';
import type { MessageKey } from '@/lib/i18n';
import {
  CalendarCheck,
  AlertTriangle,
  Apple,
  Heart,
  Baby,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react';

export const MOTHER_NAV_ITEMS: {
  labelKey: MessageKey;
  icon: LucideIcon;
  view: AppView;
  color: string;
}[] = [
  {
    labelKey: 'navDashboard',
    icon: LayoutDashboard,
    view: 'motherDashboard',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    labelKey: 'navAnc',
    icon: CalendarCheck,
    view: 'ancTracker',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    labelKey: 'navDanger',
    icon: AlertTriangle,
    view: 'dangerSigns',
    color: 'text-red-600 bg-red-50',
  },
  {
    labelKey: 'navNutrition',
    icon: Apple,
    view: 'nutrition',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    labelKey: 'navWellness',
    icon: Heart,
    view: 'wellnessCheck',
    color: 'text-pink-600 bg-pink-50',
  },
  {
    labelKey: 'navDelivery',
    icon: Baby,
    view: 'deliveryPrep',
    color: 'text-blue-600 bg-blue-50',
  },
];

export const MOTHER_FEATURE_CARDS = MOTHER_NAV_ITEMS.filter(
  (item) => item.view !== 'motherDashboard'
);
