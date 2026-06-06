'use client';

import type { AppView } from '@/lib/types';
import { MOTHER_NAV_ITEMS } from '@/lib/motherNav';
import { cn } from '@/lib/cn';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

interface Props {
  currentView: AppView;
  navigate: (view: AppView) => void;
}

export default function MotherNavBar({ currentView, navigate }: Props) {
  const { t } = useLocale();

  return (
    <nav
      className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 overflow-x-auto"
      aria-label="Mother section navigation"
    >
      <div className="flex gap-2 pb-1 min-w-max">
        {MOTHER_NAV_ITEMS.map(({ labelKey, icon: Icon, view }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              type="button"
              onClick={() => navigate(view)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                active ? ds.navPillActive : ds.navPillInactive
              )}
            >
              <Icon size={14} />
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
