'use client';

import type { AppView, DemoMother, MotherFlag, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  mother: DemoMother;
  onSelect: (mother: DemoMother) => void;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'bg-teal-100 text-teal-800',
  monitoring: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low',
  monitoring: 'Monitor',
  high: 'High',
};

const FLAG_STYLES: Record<MotherFlag, string> = {
  danger_sign: 'bg-rose-100 text-rose-700',
  missed_anc: 'bg-amber-100 text-amber-700',
  nutrition_concern: 'bg-orange-100 text-orange-700',
  wellness_concern: 'bg-sky-100 text-sky-700',
};

const FLAG_LABELS: Record<MotherFlag, string> = {
  danger_sign: 'Danger sign',
  missed_anc: 'Missed ANC',
  nutrition_concern: 'Nutrition',
  wellness_concern: 'Wellness',
};

export default function PriorityMotherCard({ mother, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mother)}
      className={cn(
        ds.card,
        ds.cardPadding,
        'text-left w-full hover:shadow-md hover:border-teal-200/60 transition-all active:scale-[0.99]'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{mother.name}</p>
          <p className="text-sm text-slate-500">
            Week {mother.gestationalAgeWeeks} · {mother.kebele}
          </p>
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0',
            RISK_COLORS[mother.riskLevel]
          )}
        >
          {RISK_LABELS[mother.riskLevel]}
        </span>
      </div>

      {mother.flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {mother.flags.map((flag) => (
            <span
              key={flag}
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                FLAG_STYLES[flag]
              )}
            >
              {FLAG_LABELS[flag]}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3">
        Last seen {mother.lastSeen} days ago
      </p>
    </button>
  );
}
