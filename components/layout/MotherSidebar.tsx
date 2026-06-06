'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOTHER_NAV_ITEMS } from '@/lib/motherNav';
import { cn } from '@/lib/cn';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';

function isActive(pathname: string, href: string): boolean {
  return pathname === href;
}

export default function MotherSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav
        className="sticky top-6 flex flex-col gap-1"
        aria-label="Mother section navigation"
      >
        <p className={cn(ds.sectionLabel, 'px-3 mb-2')}>Navigation</p>
        {MOTHER_NAV_ITEMS.map(({ labelKey, icon: Icon, href, iconStyle }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active ? ds.navActive : ds.navInactive
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                  active ? 'bg-white/20 text-white' : iconStyle
                )}
              >
                <Icon size={16} />
              </span>
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
