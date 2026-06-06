'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { FamilySupport, MotherProfile } from '@/lib/types';
import { calcGestationalWeeks, calculateRisk } from '@/lib/riskLogic';
import { calcEDD } from '@/lib/ancLogic';
import { saveProfileToServer } from '@/lib/motherApi';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import WebHeader from '@/components/layout/WebHeader';
import PageContainer from '@/components/layout/PageContainer';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  inputClassName,
  labelClassName,
  selectClassName,
} from '@/components/ui/FormField';
import Card, { Button } from '@/components/ui/Card';
import YesNoField from '@/components/ui/YesNoField';
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

const STEPS = ['stepAboutYou', 'stepLocation', 'stepPregnancy'] as const;

export default function MotherOnboardingPage({ onComplete }: Props) {
  const { t, tf } = useLocale();
  const { data: session } = useSession();
  const { profile: existing } = useMotherData();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState<Partial<MotherProfile>>({
    name: existing?.name ?? session?.user?.name ?? '',
    age: existing?.age,
    phone: existing?.phone ?? '',
    alternativePhone: existing?.alternativePhone ?? '',
    partnerName: existing?.partnerName ?? '',
    partnerPhone: existing?.partnerPhone ?? '',
    region: existing?.region ?? '',
    zone: existing?.zone ?? '',
    woreda: existing?.woreda ?? '',
    kebele: existing?.kebele ?? '',
    village: existing?.village ?? '',
    previousCSection: existing?.previousCSection ?? false,
    previousStillbirth: existing?.previousStillbirth ?? false,
    multiplePregnancy: existing?.multiplePregnancy ?? false,
    hypertension: false,
    diabetes: false,
    hiv: false,
    anemia: false,
    tb: false,
    familySupport: existing?.familySupport ?? 'yes',
    mealsPerDay: existing?.mealsPerDay ?? 3,
    livingChildren: existing?.livingChildren ?? 0,
    gravidity: existing?.gravidity,
    parity: existing?.parity,
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
  const edd = formData.lmp ? calcEDD(formData.lmp) : null;

  const handleComplete = async () => {
    setSaveError('');
    setSaving(true);
    try {
      const gestationalAgeWeeks = calcGestationalWeeks(formData.lmp!);
      const partial = { ...formData, gestationalAgeWeeks } as MotherProfile;
      const { riskLevel, riskFactors } = calculateRisk(partial);
      const profile: MotherProfile = {
        ...formData,
        id: existing?.id ?? crypto.randomUUID(),
        lmp: formData.lmp!,
        gestationalAgeWeeks,
        edd: calcEDD(formData.lmp!),
        riskLevel,
        riskFactors,
        plannedPregnancy: formData.plannedPregnancy,
        wantedPregnancy: formData.wantedPregnancy,
        registeredAt: existing?.registeredAt ?? new Date().toISOString(),
        registeredBy: 'self',
      } as MotherProfile;
      await saveProfileToServer(profile);
      onComplete();
    } catch {
      setSaveError(t('saveProfileError'));
    } finally {
      setSaving(false);
    }
  };

  const canProceedStep1 =
    formData.name && formData.age && formData.phone;
  const canProceedStep2 = formData.region && formData.kebele;
  const canProceedStep3 =
    formData.lmp &&
    formData.gravidity !== undefined &&
    formData.parity !== undefined &&
    formData.livingChildren !== undefined;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <WebHeader
        title={t('registration')}
        subtitle={tf('registrationStep', { step, total: STEPS.length })}
        showBrand
      />

      <PageContainer narrow className="py-8 lg:py-12 flex-1">
        <div className="flex gap-2 mb-6 max-w-lg">
          {STEPS.map((key, i) => (
            <div key={key} className="flex-1">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-colors mb-1',
                  step >= i + 1 ? 'bg-teal-500' : 'bg-slate-200'
                )}
              />
              <p className="text-[10px] text-slate-500 truncate hidden sm:block">
                {t(key)}
              </p>
            </div>
          ))}
        </div>

        <Card padding className="lg:p-8">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <label className={labelClassName}>{t('fullName')}</label>
                <input
                  type="text"
                  value={formData.name ?? ''}
                  onChange={(e) => setField('name', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>{t('fieldAge')}</label>
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
                <label className={labelClassName}>{t('fieldPhone')}</label>
                <input
                  type="tel"
                  value={formData.phone ?? ''}
                  onChange={(e) => setField('phone', e.target.value)}
                  className={inputClassName}
                  placeholder="+251..."
                />
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldAltPhone')} ({t('optional')})
                </label>
                <input
                  type="tel"
                  value={formData.alternativePhone ?? ''}
                  onChange={(e) => setField('alternativePhone', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldPartnerName')} ({t('optional')})
                </label>
                <input
                  type="text"
                  value={formData.partnerName ?? ''}
                  onChange={(e) => setField('partnerName', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldPartnerPhone')} ({t('optional')})
                </label>
                <input
                  type="tel"
                  value={formData.partnerPhone ?? ''}
                  onChange={(e) => setField('partnerPhone', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                fullWidth
                className="md:col-span-2 mt-2"
              >
                {t('continue')}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className={labelClassName}>{t('fieldRegion')}</label>
                <select
                  value={formData.region ?? ''}
                  onChange={(e) => setField('region', e.target.value)}
                  className={selectClassName}
                >
                  <option value="">{t('select')}</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldKebele')}
                </label>
                <input
                  type="text"
                  value={formData.kebele ?? ''}
                  onChange={(e) => setField('kebele', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldWoreda')} ({t('optional')})
                </label>
                <input
                  type="text"
                  value={formData.woreda ?? ''}
                  onChange={(e) => setField('woreda', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldVillage')} ({t('optional')})
                </label>
                <input
                  type="text"
                  value={formData.village ?? ''}
                  onChange={(e) => setField('village', e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div className="md:col-span-2 flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => setStep(1)}
                  fullWidth
                  className="flex-1"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  fullWidth
                  className="flex-1"
                >
                  {t('continue')}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <label className={labelClassName}>{t('fieldLmp')}</label>
                <input
                  type="date"
                  value={formData.lmp ?? ''}
                  onChange={(e) => setField('lmp', e.target.value)}
                  className={inputClassName}
                />
                {gestationalWeeks !== null && (
                  <div className="mt-2 space-y-1">
                    <p className={cn('text-sm font-medium', ds.brandText)}>
                      {tf('gestationalWeek', { weeks: gestationalWeeks })}
                    </p>
                    {edd && (
                      <p className="text-xs text-slate-500">
                        {tf('estimatedDue', {
                          date: new Date(edd).toLocaleDateString(),
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClassName}>{t('fieldPregnancies')}</label>
                <select
                  value={formData.gravidity ?? ''}
                  onChange={(e) =>
                    setField('gravidity', parseInt(e.target.value, 10))
                  }
                  className={selectClassName}
                >
                  <option value="">{t('select')}</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 4 ? '4+' : n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t('fieldBirths')}</label>
                <select
                  value={formData.parity ?? ''}
                  onChange={(e) =>
                    setField('parity', parseInt(e.target.value, 10))
                  }
                  className={selectClassName}
                >
                  <option value="">{t('select')}</option>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 4 ? '4+' : n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>
                  {t('fieldLivingChildren')}
                </label>
                <select
                  value={formData.livingChildren ?? ''}
                  onChange={(e) =>
                    setField('livingChildren', parseInt(e.target.value, 10))
                  }
                  className={selectClassName}
                >
                  <option value="">{t('select')}</option>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 4 ? '4+' : n}
                    </option>
                  ))}
                </select>
              </div>
              <YesNoField
                label={t('fieldTwins')}
                value={formData.multiplePregnancy}
                onChange={(v) => setField('multiplePregnancy', v)}
                yesLabel={t('yes')}
                noLabel={t('no')}
              />
              <YesNoField
                label={t('fieldPrevCS')}
                value={formData.previousCSection}
                onChange={(v) => setField('previousCSection', v)}
                yesLabel={t('yes')}
                noLabel={t('no')}
              />
              <YesNoField
                label={t('fieldPrevStillbirth')}
                value={formData.previousStillbirth}
                onChange={(v) => setField('previousStillbirth', v)}
                yesLabel={t('yes')}
                noLabel={t('no')}
              />
              <div className="md:col-span-2">
                <label className={`${labelClassName} mb-2 block`}>
                  {t('fieldFamilySupport')}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      ['supportYes', 'yes'],
                      ['supportSomewhat', 'somewhat'],
                      ['supportNo', 'no'],
                    ] as const
                  ).map(([labelKey, value]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setField('familySupport', value as FamilySupport)
                      }
                      className={cn(
                        'flex-1 min-w-[100px] py-2 px-3 rounded-xl text-sm font-medium border transition-colors',
                        formData.familySupport === value
                          ? ds.navPillActive + ' border-teal-600'
                          : ds.navPillInactive
                      )}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={`${labelClassName} mb-2 block`}>
                  {t('fieldMeals')}
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      ['mealsOne', 1],
                      ['mealsTwo', 2],
                      ['mealsThree', 3],
                    ] as const
                  ).map(([labelKey, value]) => (
                    <button
                      key={labelKey}
                      type="button"
                      onClick={() => setField('mealsPerDay', value)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                        formData.mealsPerDay === value
                          ? ds.navPillActive + ' border-teal-600'
                          : ds.navPillInactive
                      )}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  fullWidth
                  className="flex-1"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={handleComplete}
                  fullWidth
                  className="flex-1"
                  disabled={saving || !canProceedStep3}
                >
                  {saving ? t('saving') : t('completeRegistration')}
                </Button>
              </div>
              {saveError && (
                <p className="md:col-span-2 text-sm text-rose-600">{saveError}</p>
              )}
            </div>
          )}
        </Card>
      </PageContainer>
    </div>
  );
}
