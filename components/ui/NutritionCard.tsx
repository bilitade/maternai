'use client';

import type { Food } from '@/lib/types';
import Card from '@/components/ui/Card';

interface Props {
  food: Food;
  nutrientColor: string;
}

export default function NutritionCard({ food, nutrientColor }: Props) {
  return (
    <Card hover padding>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{food.name}</p>
          <p className="text-sm text-slate-500">{food.amharic}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${nutrientColor}`}
        >
          {food.nutrient}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{food.tip}</p>
    </Card>
  );
}
