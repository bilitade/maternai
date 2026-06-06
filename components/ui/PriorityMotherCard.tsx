'use client';

import type { DemoMother, MotherFlag, RiskLevel } from '@/lib/types';

interface Props {
  mother: DemoMother;
  onSelect: (mother: DemoMother) => void;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-800',
  monitoring: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
};

const FLAG_STYLES: Record<MotherFlag, string> = {
  danger_sign: 'bg-red-100 text-red-700',
  missed_anc: 'bg-amber-100 text-amber-700',
  nutrition_concern: 'bg-orange-100 text-orange-700',
  wellness_concern: 'bg-blue-100 text-blue-700',
};

const FLAG_LABELS: Record<MotherFlag, string> = {
  danger_sign: '🔴 Danger sign',
  missed_anc: '🟠 Missed ANC',
  nutrition_concern: '🟡 Nutrition',
  wellness_concern: '🔵 Wellness',
};

export default function PriorityMotherCard({ mother, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(mother)}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left w-full hover:shadow-md transition-shadow active:scale-98"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{mother.name}</p>
          <p className="text-sm text-gray-500">
            Week {mother.gestationalAgeWeeks} · {mother.kebele}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLORS[mother.riskLevel]}`}
        >
          {mother.riskLevel === 'high'
            ? '🔴 High'
            : mother.riskLevel === 'monitoring'
              ? '🟡 Monitor'
              : '🟢 Low'}
        </span>
      </div>

      {mother.flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {mother.flags.map((flag) => (
            <span
              key={flag}
              className={`text-xs px-2 py-0.5 rounded-full ${FLAG_STYLES[flag]}`}
            >
              {FLAG_LABELS[flag]}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Last seen {mother.lastSeen} days ago
      </p>
    </button>
  );
}
