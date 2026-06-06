'use client';

import { useState } from 'react';
import type { AppView } from '@/lib/types';
import { getProfile, getDeliveryPrep, saveDeliveryPrep } from '@/lib/storage';
import MotherLayout from '@/components/layout/MotherLayout';

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
          <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 shadow-sm text-center max-w-md w-full">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-semibold text-gray-900 text-lg">
              Not yet available
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Delivery preparation unlocks at week 32. You have{' '}
              <span className="font-medium text-emerald-700">
                {32 - weeks} weeks
              </span>{' '}
              remaining.
            </p>
          </div>
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
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-semibold text-emerald-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHECKLIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-colors
                ${
                  checked.has(i)
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
            >
              <span
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs
                  ${
                    checked.has(i)
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-300'
                  }`}
              >
                {checked.has(i) ? '✓' : ''}
              </span>
              <span className="text-sm text-gray-800">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </MotherLayout>
  );
}
