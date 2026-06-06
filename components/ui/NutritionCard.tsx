'use client';

import type { Food } from '@/lib/types';

interface Props {
  food: Food;
  nutrientColor: string;
}

export default function NutritionCard({ food, nutrientColor }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{food.name}</p>
          <p className="text-sm text-gray-500">{food.amharic}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${nutrientColor}`}
        >
          {food.nutrient}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2">{food.tip}</p>
    </div>
  );
}
