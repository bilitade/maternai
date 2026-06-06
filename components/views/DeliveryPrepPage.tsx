'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import type { AppView } from '@/lib/types';
import { getProfile, getDeliveryPrep, saveDeliveryPrep } from '@/lib/storage';
import MotherLayout from '@/components/layout/MotherLayout';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

const CHECKLIST = [
  'Health facility for delivery identified',
  'Transport to facility arranged',
  'Emergency contact person named',
  'Birth companion confirmed (husband, mother, or friend)',
  'Basic newborn supplies ready (clothes, blanket, basin)',
  'Funds set aside for facility fees',
  'Blood donor identified (recommended for high-risk)',
  'HEW notified of birth plan',
];

export default function DeliveryPrepPage({
  navigate,
  currentView,
}: Props) {
  const profile = getProfile();
  const weeks = profile?.gestationalAgeWeeks ?? 0;
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(getDeliveryPrep())
  );

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      saveDeliveryPrep([...next]);
      return next;
    });
  };

  const progress = (checked.size / CHECKLIST.length) * 100;

  if (weeks < 32) {
    return (
      <MotherLayout
        currentView={currentView}
        navigate={navigate}
        title="Delivery Prep"
        subtitle="Birth preparedness checklist"
        onBack={() => navigate('motherDashboard')}
        backLabel="Dashboard"
      >
        <div className="flex items-center justify-center py-12 lg:py-20">
          <Card className="text-center max-w-md w-full py-10">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-slate-500" strokeWidth={1.75} />
            </div>
            <p className="font-semibold text-slate-900 text-lg">
              Not yet available
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Delivery preparation unlocks at week 32. You have{' '}
              <span className={cn('font-medium', ds.brandText)}>
                {32 - weeks} weeks
              </span>{' '}
              remaining.
            </p>
          </Card>
        </div>
      </MotherLayout>
    );
  }

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Delivery Prep"
      subtitle={`${Math.round(progress)}% complete · Birth preparedness checklist`}
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      <div className="max-w-3xl flex flex-col gap-6">
        <Card>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Progress</span>
            <span className={cn('font-semibold', ds.brandText)}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={ds.progressTrack}>
            <div
              className={ds.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHECKLIST.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border text-left transition-colors',
                checked.has(i)
                  ? ds.checklistDone
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              )}
            >
              <span
                className={cn(
                  'w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs',
                  checked.has(i) ? ds.checklistCheck : 'border-slate-300'
                )}
              >
                {checked.has(i) ? '✓' : ''}
              </span>
              <span className="text-sm text-slate-800 leading-snug">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </MotherLayout>
  );
}
