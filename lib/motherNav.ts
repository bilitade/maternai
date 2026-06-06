import type { LucideIcon } from 'lucide-react';
import {
  CalendarCheck,
  AlertTriangle,
  Apple,
  Heart,
  Baby,
  LayoutDashboard,
} from 'lucide-react';
import type { AppView } from '@/lib/types';
import type { MessageKey } from '@/lib/i18n';
import { featureIconColors } from '@/lib/design-system';
import { VIEW_PATH } from '@/lib/routes';

export const MOTHER_NAV_ITEMS: {
  labelKey: MessageKey;
  icon: LucideIcon;
  view: AppView;
  href: string;
  iconStyle: string;
}[] = [
  {
    labelKey: 'navDashboard',
    icon: LayoutDashboard,
    view: 'motherDashboard',
    href: VIEW_PATH.motherDashboard,
    iconStyle: featureIconColors.default,
  },
  {
    labelKey: 'navAnc',
    icon: CalendarCheck,
    view: 'ancTracker',
    href: VIEW_PATH.ancTracker,
    iconStyle: featureIconColors.anc,
  },
  {
    labelKey: 'navDanger',
    icon: AlertTriangle,
    view: 'dangerSigns',
    href: VIEW_PATH.dangerSigns,
    iconStyle: featureIconColors.danger,
  },
  {
    labelKey: 'navNutrition',
    icon: Apple,
    view: 'nutrition',
    href: VIEW_PATH.nutrition,
    iconStyle: featureIconColors.nutrition,
  },
  {
    labelKey: 'navWellness',
    icon: Heart,
    view: 'wellnessCheck',
    href: VIEW_PATH.wellnessCheck,
    iconStyle: featureIconColors.wellness,
  },
  {
    labelKey: 'navDelivery',
    icon: Baby,
    view: 'deliveryPrep',
    href: VIEW_PATH.deliveryPrep,
    iconStyle: featureIconColors.delivery,
  },
];

export const MOTHER_FEATURE_CARDS = MOTHER_NAV_ITEMS.filter(
  (item) => item.view !== 'motherDashboard'
);

export const INSIGHT_PATHS: Record<string, string> = {
  danger: VIEW_PATH.dangerSigns,
  nutrition: VIEW_PATH.nutrition,
  wellness: VIEW_PATH.wellnessCheck,
};
