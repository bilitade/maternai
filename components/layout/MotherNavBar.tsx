'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOTHER_NAV_ITEMS } from '@/lib/motherNav';
import { cn } from '@/lib/cn';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

export default function MotherNavBar() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 overflow-x-auto"
      aria-label="Mother section navigation"
    >
      <div className="flex gap-2 pb-1 min-w-max">
        {MOTHER_NAV_ITEMS.map(({ labelKey, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                active ? ds.navPillActive : ds.navPillInactive
              )}
            >
              <Icon size={14} />
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
