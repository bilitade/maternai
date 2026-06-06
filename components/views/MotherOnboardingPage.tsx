'use client';

import { useState } from 'react';
import type { FamilySupport, MotherProfile } from '@/lib/types';
import { calcGestationalWeeks, calculateRisk } from '@/lib/riskLogic';
import { saveProfile } from '@/lib/storage';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { inputClassName, labelClassName, selectClassName } from '@/components/ui/FormField';

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
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= n ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:p-8">
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
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all w-full md:col-span-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Continue
            </button>
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
                <p className="text-sm text-emerald-700 mt-2 font-medium">
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.previousCSection === (opt === 'Yes')
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.previousStillbirth === (opt === 'Yes')
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2 mt-2">
              <button
                onClick={() => setStep(1)}
                className="border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex-1"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.hypertension === (opt === 'Yes')
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.diabetes === (opt === 'Yes')
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.familySupport === value
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
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
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                      ${
                        formData.mealsPerDay === value
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2 mt-2">
              <button
                onClick={() => setStep(2)}
                className="border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex-1"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all flex-1"
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}
        </div>
      </PageContainer>
    </div>
  );
}
