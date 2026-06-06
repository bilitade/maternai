'use client';

import { useEffect, useState } from 'react';
import type { AppView, DemoMother } from '@/lib/types';
import { SAMPLE_MOTHERS } from '@/data/sampleMothers';
import { getProfile } from '@/lib/storage';
import { profileToDemoMother, sortMothersByPriority } from '@/lib/hewHelpers';
import PriorityMotherCard from '@/components/ui/PriorityMotherCard';
import HEWLayout from '@/components/layout/HEWLayout';
import { useLocale } from '@/components/providers/LocaleProvider';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  navigate: (view: AppView) => void;
  onSelectMother: (m: DemoMother) => void;
  onLogout?: () => void;
}

export default function HEWDashboard({ navigate, onSelectMother, onLogout }: Props) {
  const { t } = useLocale();
  const [mothers, setMothers] = useState<DemoMother[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/hew/mothers');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setMothers(data.mothers);
          return;
        }
      } catch {
        /* fall through to local */
      }
      const profile = getProfile();
      const registeredMother = profile ? profileToDemoMother(profile) : null;
      if (!cancelled) {
        setMothers(
          sortMothersByPriority([
            ...(registeredMother ? [registeredMother] : []),
            ...SAMPLE_MOTHERS.filter(
              (m) => !registeredMother || m.id !== registeredMother.id
            ),
          ])
        );
      }
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      headerActions={
        onLogout ? (
          <button type="button" onClick={onLogout} className={ds.headerAction}>
            Sign out
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        {loading ? (
          <p className="text-sm text-slate-500">Loading mothers from database...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total mothers', value: total, color: 'text-slate-800' },
                { label: 'High risk', value: highRisk, color: 'text-rose-600' },
                { label: 'Missed ANC', value: missedANC, color: 'text-amber-600' },
                {
                  label: 'Wellness concern',
                  value: wellnessConcern,
                  color: 'text-sky-600',
                },
              ].map(({ label, value, color }) => (
                <Card key={label}>
                  <p className={cn('text-2xl lg:text-3xl font-bold', color)}>
                    {value}
                  </p>
                  <p className="text-xs lg:text-sm text-slate-500 mt-1">{label}</p>
                </Card>
              ))}
            </div>

            <div>
              <h2 className={cn(ds.sectionLabel, 'mb-4')}>Priority list</h2>
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
          </>
        )}
      </div>
    </HEWLayout>
  );
}
