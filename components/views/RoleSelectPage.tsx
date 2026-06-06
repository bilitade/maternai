'use client';

import { Heart, Stethoscope } from 'lucide-react';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { useLocale } from '@/components/providers/LocaleProvider';

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
      border: 'hover:border-pink-400',
      iconColor: 'text-pink-600 bg-pink-50',
    },
    {
      role: 'hew' as const,
      label: t('roleHew'),
      sub: t('roleHewSub'),
      Icon: Stethoscope,
      border: 'hover:border-emerald-500',
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <WebHeader
        title={t('welcomeTitle')}
        subtitle={t('welcomeSubtitle')}
        showBrand
      />
      <PageContainer narrow className="py-8 lg:py-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {roles.map(({ role, label, sub, Icon, border, iconColor }) => (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className={`bg-white border-2 border-gray-200 ${border} rounded-2xl p-6 lg:p-8 text-left cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-[0.99]`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}
              >
                <Icon size={28} />
              </div>
              <p className="font-semibold text-gray-900 text-lg lg:text-xl">
                {label}
              </p>
              <p className="text-sm lg:text-base text-gray-500 mt-2">{sub}</p>
            </button>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
