'use client';

import type { AppView } from '@/lib/types';
import { MOTHER_NAV_ITEMS } from '@/lib/motherNav';
import { cn } from '@/lib/cn';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  currentView: AppView;
  navigate: (view: AppView) => void;
}

export default function MotherSidebar({ currentView, navigate }: Props) {
  const { t } = useLocale();

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav
        className="sticky top-6 flex flex-col gap-1"
        aria-label="Mother section navigation"
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {MOTHER_NAV_ITEMS.map(({ labelKey, icon: Icon, view, color }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              onClick={() => navigate(view)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                active
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  active ? 'bg-emerald-500 text-white' : color
                )}
              >
                <Icon size={16} />
              </span>
              {t(labelKey)}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
