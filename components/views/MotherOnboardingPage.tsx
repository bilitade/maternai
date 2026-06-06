'use client';

import { useState } from 'react';
import type { FamilySupport, MotherProfile } from '@/lib/types';
import { calcGestationalWeeks, calculateRisk } from '@/lib/riskLogic';
import { saveProfile } from '@/lib/storage';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { inputClassName, labelClassName, selectClassName } from '@/components/ui/FormField';
import Card, { Button } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  onComplete: () => void;
}

const REGIONS = [
  'Addis Ababa',
  'Amhara',
  'Oromia',
  'SNNP',
  'Tigray',
  'Other',
];

export default function MotherOnboardingPage({ onComplete }: Props) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MotherProfile>>({
    previousCSection: false,
    previousStillbirth: false,
    hypertension: false,
    diabetes: false,
    familySupport: 'yes',
    mealsPerDay: 3,
  });

  const setField = <K extends keyof MotherProfile>(
    key: K,
    value: MotherProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const gestationalWeeks = formData.lmp
    ? calcGestationalWeeks(formData.lmp)
    : null;

  const handleComplete = () => {
    const gestationalAgeWeeks = calcGestationalWeeks(formData.lmp!);
    const partial = {
      ...formData,
      gestationalAgeWeeks,
    } as MotherProfile;
    const { riskLevel, riskFactors } = calculateRisk(partial);
    const profile: MotherProfile = {
      ...formData,
      id: crypto.randomUUID(),
      gestationalAgeWeeks,
      riskLevel,
      riskFactors,
      registeredAt: new Date().toISOString(),
      registeredBy: 'self',
    } as MotherProfile;
    saveProfile(profile);
    onComplete();
  };

  const canProceedStep1 =
    formData.name && formData.age && formData.phone && formData.region && formData.kebele;
  const canProceedStep2 =
    formData.lmp &&
    formData.gravidity !== undefined &&
    formData.parity !== undefined;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <WebHeader
        title={t('registration')}
        subtitle={`Step ${step} of 3 · ${t('registrationSub')}`}
        showBrand
      />

      <PageContainer narrow className="py-8 lg:py-12 flex-1">
        <div className="flex gap-2 mb-8 max-w-md">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                step >= n ? 'bg-teal-500' : 'bg-slate-200'
              )}
            />
          ))}
        </div>

        <Card padding className="lg:p-8">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className={labelClassName}>Full name</label>
              <input
                type="text"
                value={formData.name ?? ''}
                onChange={(e) => setField('name', e.target.value)}
                className={inputClassName}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={labelClassName}>Age</label>
              <input
                type="number"
                min={14}
                max={55}
                value={formData.age ?? ''}
                onChange={(e) => setField('age', parseInt(e.target.value, 10))}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>Phone</label>
              <input
                type="tel"
                value={formData.phone ?? ''}
                onChange={(e) => setField('phone', e.target.value)}
                className={inputClassName}
                placeholder="+251..."
              />
            </div>
            <div>
              <label className={labelClassName}>Region</label>
              <select
                value={formData.region ?? ''}
                onChange={(e) => setField('region', e.target.value)}
                className={selectClassName}
              >
                <option value="">Select region</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Kebele</label>
              <input
                type="text"
                value={formData.kebele ?? ''}
                onChange={(e) => setField('kebele', e.target.value)}
                className={inputClassName}
                placeholder="Your kebele"
              />
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              fullWidth
              className="md:col-span-2 mt-2"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className={labelClassName}>
                Last menstrual period (LMP)
              </label>
              <input
                type="date"
                value={formData.lmp ?? ''}
                onChange={(e) => setField('lmp', e.target.value)}
                className={inputClassName}
              />
              {gestationalWeeks !== null && (
                <p className={cn('text-sm mt-2 font-medium', ds.brandText)}>
                  You are approximately {gestationalWeeks} weeks pregnant
                </p>
              )}
            </div>
            <div>
              <label className={labelClassName}>
                Gravidity (pregnancies)
              </label>
              <select
                value={formData.gravidity ?? ''}
                onChange={(e) =>
                  setField('gravidity', parseInt(e.target.value, 10))
                }
                className={selectClassName}
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n === 4 ? '4+' : n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>
                Parity (live births)
              </label>
              <select
                value={formData.parity ?? ''}
                onChange={(e) =>
                  setField('parity', parseInt(e.target.value, 10))
                }
                className={selectClassName}
              >
                <option value="">Select</option>
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n === 4 ? '4+' : n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Previous C-section?
              </label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setField('previousCSection', opt === 'Yes')
                    }
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.previousCSection === (opt === 'Yes')
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Previous stillbirth?
              </label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setField('previousStillbirth', opt === 'Yes')
                    }
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.previousStillbirth === (opt === 'Yes')
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2 mt-2">
              <Button variant="secondary" onClick={() => setStep(1)} fullWidth className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                fullWidth
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Hypertension?
              </label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setField('hypertension', opt === 'Yes')}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.hypertension === (opt === 'Yes')
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Diabetes?
              </label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setField('diabetes', opt === 'Yes')}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.diabetes === (opt === 'Yes')
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Family support
              </label>
              <div className="flex gap-2">
                {(
                  [
                    ['Yes', 'yes'],
                    ['Somewhat', 'somewhat'],
                    ['No', 'no'],
                  ] as const
                ).map(([label, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setField('familySupport', value as FamilySupport)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.familySupport === value
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Meals per day
              </label>
              <div className="flex gap-2">
                {(
                  [
                    ['1', 1],
                    ['2', 2],
                    ['3+', 3],
                  ] as const
                ).map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setField('mealsPerDay', value)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                      formData.mealsPerDay === value
                        ? ds.navPillActive + ' border-teal-600'
                        : ds.navPillInactive
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2 mt-2">
              <Button variant="secondary" onClick={() => setStep(2)} fullWidth className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} fullWidth className="flex-1">
                Complete Registration
              </Button>
            </div>
          </div>
        )}
        </Card>
      </PageContainer>
    </div>
  );
}
