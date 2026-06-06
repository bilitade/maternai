'use client';

import { useState } from 'react';
import type { Food, NutritionProfile } from '@/lib/types';
import { FOODS } from '@/data/ethiopianFoods';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { saveAIInsights, saveNutritionProfile } from '@/lib/motherApi';
import { getTrimester } from '@/lib/riskLogic';
import { dietaryDiversityStatus } from '@/lib/nutritionLogic';
import { getNutritionTip } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getFoodGroups } from '@/lib/locale/content';
import NutritionCard from '@/components/ui/NutritionCard';
import Card, { Button } from '@/components/ui/Card';
import { VIEW_PATH } from '@/lib/routes';
import AIResponsePanel from '@/components/ai/AIResponsePanel';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import type { AIResult } from '@/lib/ai';

type Trimester = 1 | 2 | 3;
type Tab = 'food' | 'guide';

const NUTRIENT_COLORS: Record<Food['nutrient'], string> = {
  Iron: 'bg-rose-100 text-rose-700',
  Protein: 'bg-sky-100 text-sky-700',
  Folate: 'bg-teal-100 text-teal-700',
  Energy: 'bg-amber-100 text-amber-700',
  Calcium: 'bg-violet-100 text-violet-700',
};

export default function NutritionPage() {
  const { t, tf, locale } = useLocale();
  const { profile, aiInsights, nutritionProfile, patchLocal } = useMotherData();
  const weeks = profile?.gestationalAgeWeeks ?? 20;
  const foodGroups = getFoodGroups(locale);

  useMotherPageHeader({
    title: t('nutritionTitle'),
    subtitle: t('nutritionSubtitle'),
    backHref: VIEW_PATH.motherDashboard,
    backLabel: t('dashboard'),
  });

  const [tab, setTab] = useState<Tab>('food');
  const [activeTrimester, setActiveTrimester] = useState<Trimester>(
    getTrimester(weeks)
  );
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(() => {
    const count = nutritionProfile.dietaryDiversityScore ?? 0;
    return new Set(Array.from({ length: count }, (_, i) => i));
  });
  const [savingFood, setSavingFood] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [tipLoading, setTipLoading] = useState(false);
  const [tipPromise, setTipPromise] = useState<Promise<AIResult> | null>(null);
  const [tipError, setTipError] = useState<string | null>(null);

  const diversityScore = selectedGroups.size;
  const diversity = dietaryDiversityStatus(diversityScore);

  const saveFood = async () => {
    setSaveError('');
    setSavingFood(true);
    try {
      const next: NutritionProfile = {
        ...nutritionProfile,
        dietaryDiversityScore: diversityScore,
        updatedAt: new Date().toISOString(),
      };
      await saveNutritionProfile(next);
      patchLocal({ nutritionProfile: next });
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : t('saveProfileError')
      );
    } finally {
      setSavingFood(false);
    }
  };

  const toggleGroup = (index: number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const fetchTip = () => {
    setTipError(null);
    setTipLoading(true);
    const promise = getNutritionTip(weeks, profile?.riskFactors ?? [], locale)
      .then(async (result) => {
        const insight = {
          type: 'nutrition' as const,
          text: result.text,
          source: result.source,
          date: new Date().toISOString(),
          meta: { score: diversityScore },
        };
        const nextInsights = [...aiInsights.slice(-19), insight];
        await saveAIInsights(nextInsights);
        patchLocal({ aiInsights: nextInsights });
        return result;
      })
      .catch(() => {
        setTipError(t('aiError'));
        return { text: t('aiError'), source: 'offline' as const };
      })
      .finally(() => setTipLoading(false));

    setTipPromise(promise);
  };

  const filteredFoods = FOODS.filter((f) =>
    f.trimesters.includes(activeTrimester)
  );

  const hasCachedTip = aiInsights.some((i) => i.type === 'nutrition');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 max-w-md">
        {(
          [
            ['food', t('nutritionTabFood')],
            ['guide', t('nutritionTabGuide')],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-medium transition-colors',
              tab === key ? ds.navPillActive : ds.navPillInactive
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'food' && (
        <div className="flex flex-col gap-4 max-w-3xl">
          <Card>
            <p className="text-sm font-medium text-slate-800 mb-1">
              {t('nutritionFoodPrompt')}
            </p>
            <p className="text-xs text-slate-500 mb-3">
              {tf('nutritionFoodHint', { count: diversityScore })}
              {' · '}
              {diversity === 'adequate'
                ? t('nutritionFoodGood')
                : t('nutritionFoodLow')}
            </p>
            <div className="flex flex-wrap gap-2">
              {foodGroups.map((group, i) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => toggleGroup(i)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border transition-colors text-left',
                    selectedGroups.has(i) ? ds.chipSelected : ds.chipDefault
                  )}
                >
                  {group}
                </button>
              ))}
            </div>
          </Card>

          <Button
            onClick={saveFood}
            disabled={savingFood}
            className="w-full sm:w-auto"
          >
            {savingFood ? t('saving') : t('nutritionSaveFood')}
          </Button>
          {saveError && <p className="text-sm text-rose-600">{saveError}</p>}
        </div>
      )}

      {tab === 'guide' && (
        <>
          <Button
            onClick={fetchTip}
            disabled={tipLoading}
            className="sm:w-auto sm:self-start"
          >
            {tipLoading
              ? t('nutritionGettingTip')
              : hasCachedTip || tipPromise
                ? t('nutritionRefreshTip')
                : t('nutritionGetTip')}
          </Button>

          <AIResponsePanel
            promise={tipPromise}
            loading={tipLoading}
            loadingMessage={tf('nutritionWeekTip', { weeks })}
            title={t('nutritionTipTitle')}
            errorMessage={tipError ?? undefined}
          />

          {!tipPromise && !tipLoading && hasCachedTip && (
            <div className={ds.alertSuccess}>
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-2">
                {t('nutritionTipTitle')}
              </p>
              <p className={ds.alertSuccessText}>
                {
                  [...aiInsights].reverse().find((i) => i.type === 'nutrition')
                    ?.text
                }
              </p>
            </div>
          )}

          <div className="flex gap-2 max-w-md">
            {([1, 2, 3] as Trimester[]).map((tri) => (
              <button
                key={tri}
                type="button"
                onClick={() => setActiveTrimester(tri)}
                className={cn(
                  'flex-1 py-2 rounded-xl text-sm font-medium transition-colors',
                  activeTrimester === tri ? ds.navPillActive : ds.navPillInactive
                )}
              >
                {tf('nutritionTrimester', { n: tri })}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <NutritionCard
                key={food.name}
                food={food}
                nutrientColor={NUTRIENT_COLORS[food.nutrient]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
