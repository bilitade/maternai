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

export const MOTHER_NAV_ITEMS: {
  labelKey: MessageKey;
  icon: LucideIcon;
  view: AppView;
  iconStyle: string;
}[] = [
  {
    labelKey: 'navDashboard',
    icon: LayoutDashboard,
    view: 'motherDashboard',
    iconStyle: featureIconColors.default,
  },
  {
    labelKey: 'navAnc',
    icon: CalendarCheck,
    view: 'ancTracker',
    iconStyle: featureIconColors.anc,
  },
  {
    labelKey: 'navDanger',
    icon: AlertTriangle,
    view: 'dangerSigns',
    iconStyle: featureIconColors.danger,
  },
  {
    labelKey: 'navNutrition',
    icon: Apple,
    view: 'nutrition',
    iconStyle: featureIconColors.nutrition,
  },
  {
    labelKey: 'navWellness',
    icon: Heart,
    view: 'wellnessCheck',
    iconStyle: featureIconColors.wellness,
  },
  {
    labelKey: 'navDelivery',
    icon: Baby,
    view: 'deliveryPrep',
    iconStyle: featureIconColors.delivery,
  },
];

export const MOTHER_FEATURE_CARDS = MOTHER_NAV_ITEMS.filter(
  (item) => item.view !== 'motherDashboard'
);
