'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { AppView, Food } from '@/lib/types';
import { FOODS } from '@/data/ethiopianFoods';
import { getProfile, saveAIInsight } from '@/lib/storage';
import { getTrimester } from '@/lib/riskLogic';
import { getNutritionTip } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import NutritionCard from '@/components/ui/NutritionCard';
import MotherLayout from '@/components/layout/MotherLayout';
import { Button } from '@/components/ui/Card';
import AISourceBadge from '@/components/ui/AISourceBadge';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

type Trimester = 1 | 2 | 3;

const NUTRIENT_COLORS: Record<Food['nutrient'], string> = {
  Iron: 'bg-rose-100 text-rose-700',
  Protein: 'bg-sky-100 text-sky-700',
  Folate: 'bg-teal-100 text-teal-700',
  Energy: 'bg-amber-100 text-amber-700',
  Calcium: 'bg-violet-100 text-violet-700',
};

export default function NutritionPage({ navigate, currentView }: Props) {
  const { t } = useLocale();
  const profile = getProfile();
  const weeks = profile?.gestationalAgeWeeks ?? 20;
  const [activeTrimester, setActiveTrimester] = useState<Trimester>(
    getTrimester(weeks)
  );
  const [tip, setTip] = useState<string | null>(null);
  const [tipSource, setTipSource] = useState<'ai' | 'offline' | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredFoods = FOODS.filter((f) =>
    f.trimesters.includes(activeTrimester)
  );

  const fetchTip = async () => {
    setLoading(true);
    try {
      const { text, source } = await getNutritionTip(
        weeks,
        profile?.riskFactors ?? []
      );
      setTip(text);
      setTipSource(source);
      saveAIInsight({
        type: 'nutrition',
        text,
        source,
        date: new Date().toISOString(),
        meta: { score: weeks },
      });
    } catch {
      setTip(t('aiError'));
      setTipSource(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Nutrition Guide"
      subtitle={`Week ${weeks} — personalized AI tip + Ethiopian foods`}
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      <div className="flex flex-col gap-6">
        <div className={ds.alertSuccess}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Your AI nutrition tip
            </p>
            {tipSource && <AISourceBadge source={tipSource} />}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-teal-700">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Generating tip for week {weeks}...</span>
            </div>
          ) : tip ? (
            <p className={ds.alertSuccessText}>{tip}</p>
          ) : null}
          <Button
            variant="secondary"
            onClick={fetchTip}
            disabled={loading}
            className="mt-3"
          >
            Refresh tip
          </Button>
        </div>

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
              Trimester {tri}
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
      </div>
    </MotherLayout>
  );
}
