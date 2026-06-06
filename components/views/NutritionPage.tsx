'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { AppView, Food } from '@/lib/types';
import { FOODS } from '@/data/ethiopianFoods';
import { getProfile } from '@/lib/storage';
import { getTrimester } from '@/lib/riskLogic';
import { getNutritionTip } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import NutritionCard from '@/components/ui/NutritionCard';
import MotherLayout from '@/components/layout/MotherLayout';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

type Trimester = 1 | 2 | 3;

const NUTRIENT_COLORS: Record<Food['nutrient'], string> = {
  Iron: 'bg-red-100 text-red-700',
  Protein: 'bg-blue-100 text-blue-700',
  Folate: 'bg-green-100 text-green-700',
  Energy: 'bg-amber-100 text-amber-700',
  Calcium: 'bg-purple-100 text-purple-700',
};

export default function NutritionPage({ navigate, currentView }: Props) {
  const { t } = useLocale();
  const profile = getProfile();
  const [activeTrimester, setActiveTrimester] = useState<Trimester>(
    getTrimester(profile?.gestationalAgeWeeks ?? 12)
  );
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredFoods = FOODS.filter((f) =>
    f.trimesters.includes(activeTrimester)
  );

  const handleGetTip = async () => {
    setLoading(true);
    setTip(null);
    try {
      const text = await getNutritionTip(
        profile?.gestationalAgeWeeks ?? 20,
        profile?.riskFactors ?? []
      );
      setTip(text);
    } catch {
      setTip(t('aiError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Nutrition Guide"
      subtitle="Ethiopian foods for a healthy pregnancy"
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex gap-2 flex-1 max-w-md">
            {([1, 2, 3] as Trimester[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTrimester(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors
                  ${
                    activeTrimester === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Trimester {t}
              </button>
            ))}
          </div>
          <button
            onClick={handleGetTip}
            disabled={loading}
            className="bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 sm:shrink-0"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Getting tip...' : 'Get My Tip'}
          </button>
        </div>

        {tip && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p className="text-sm text-emerald-800">{tip}</p>
          </div>
        )}

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
