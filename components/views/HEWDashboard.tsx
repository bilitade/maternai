'use client';

import { useEffect, useState } from 'react';
import type { DemoMother } from '@/lib/types';
import PriorityMotherCard from '@/components/ui/PriorityMotherCard';
import HEWLayout from '@/components/layout/HEWLayout';
import { useLocale } from '@/components/providers/LocaleProvider';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  onSelectMother: (m: DemoMother) => void;
  onLogout?: () => void;
}

export default function HEWDashboard({ onSelectMother, onLogout }: Props) {
  const { t } = useLocale();
  const [mothers, setMothers] = useState<DemoMother[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/hew/mothers', { cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          setError('Could not load mothers from database.');
          setMothers([]);
          return;
        }
        const data = await res.json();
        setMothers(data.mothers);
      } catch {
        if (!cancelled) {
          setError('Network error loading mothers.');
          setMothers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

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
        ) : error ? (
          <Card>
            <p className="text-sm text-rose-600">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={cn('text-sm mt-2 font-medium', ds.brandText)}
            >
              Retry
            </button>
          </Card>
        ) : mothers.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">
              No registered mothers yet. Mothers appear here after they create an
              account and complete onboarding.
            </p>
          </Card>
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
