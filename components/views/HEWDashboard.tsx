'use client';

import type { AppView, DemoMother } from '@/lib/types';
import { SAMPLE_MOTHERS } from '@/data/sampleMothers';
import { getProfile } from '@/lib/storage';
import { profileToDemoMother, sortMothersByPriority } from '@/lib/hewHelpers';
import PriorityMotherCard from '@/components/ui/PriorityMotherCard';
import HEWLayout from '@/components/layout/HEWLayout';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  navigate: (view: AppView) => void;
  onSelectMother: (m: DemoMother) => void;
}

export default function HEWDashboard({ navigate, onSelectMother }: Props) {
  const { t } = useLocale();
  const profile = getProfile();
  const registeredMother = profile ? profileToDemoMother(profile) : null;

  const mothers = sortMothersByPriority([
    ...(registeredMother ? [registeredMother] : []),
    ...SAMPLE_MOTHERS.filter(
      (m) => !registeredMother || m.id !== registeredMother.id
    ),
  ]);

  const total = mothers.length;
  const highRisk = mothers.filter((m) => m.riskLevel === 'high').length;
  const missedANC = mothers.filter((m) =>
    m.flags.includes('missed_anc')
  ).length;
  const wellnessConcern = mothers.filter((m) =>
    m.flags.includes('wellness_concern')
  ).length;

  return (
    <HEWLayout
      navigate={navigate}
      title={t('hewDashboard')}
      subtitle={t('hewDashboardSub')}
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total mothers', value: total, color: 'text-gray-800' },
            { label: 'High risk', value: highRisk, color: 'text-red-600' },
            { label: 'Missed ANC', value: missedANC, color: 'text-amber-600' },
            {
              label: 'Wellness concern',
              value: wellnessConcern,
              color: 'text-blue-600',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm"
            >
              <p className={`text-2xl lg:text-3xl font-bold ${color}`}>
                {value}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Priority list
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mothers.map((mother) => (
              <PriorityMotherCard
                key={mother.id}
                mother={mother}
                onSelect={onSelectMother}
              />
            ))}
          </div>
        </div>
      </div>
    </HEWLayout>
  );
}
