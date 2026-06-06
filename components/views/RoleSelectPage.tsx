'use client';

import { Heart, Stethoscope } from 'lucide-react';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  onSelect: (role: 'mother' | 'hew') => void;
}

export default function RoleSelectPage({ onSelect }: Props) {
  const { t } = useLocale();

  const roles = [
    {
      role: 'mother' as const,
      label: t('roleMother'),
      sub: t('roleMotherSub'),
      Icon: Heart,
      accent: 'group-hover:border-teal-300 group-hover:shadow-teal-100/50',
      iconStyle: 'text-rose-500 bg-rose-50 ring-1 ring-rose-100',
    },
    {
      role: 'hew' as const,
      label: t('roleHew'),
      sub: t('roleHewSub'),
      Icon: Stethoscope,
      accent: 'group-hover:border-teal-300 group-hover:shadow-teal-100/50',
      iconStyle: 'text-teal-600 bg-teal-50 ring-1 ring-teal-100',
    },
  ];

  return (
    <div className={ds.page}>
      <WebHeader
        title={t('welcomeTitle')}
        subtitle={t('welcomeSubtitle')}
        showBrand
      />
      <PageContainer narrow className="py-10 lg:py-14 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {roles.map(({ role, label, sub, Icon, accent, iconStyle }) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              className={cn(
                'group text-left cursor-pointer transition-all duration-200',
                ds.card,
                ds.cardPadding,
                'hover:shadow-lg hover:border-teal-200/80 hover:-translate-y-0.5',
                accent
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                  iconStyle
                )}
              >
                <Icon size={26} strokeWidth={1.75} />
              </div>
              <p className="font-semibold text-slate-900 text-lg lg:text-xl">
                {label}
              </p>
              <p className="text-sm lg:text-base text-slate-500 mt-2 leading-relaxed">
                {sub}
              </p>
            </button>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
