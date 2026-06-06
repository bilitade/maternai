'use client';

import type { RiskLevel } from '@/lib/types';

interface Props {
  level: RiskLevel;
  factors?: string[];
}

const CONFIG: Record<
  RiskLevel,
  { emoji: string; label: string; bg: string; text: string; sub: string }
> = {
  high: {
    emoji: '🔴',
    label: 'High-Risk Pregnancy',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    sub: 'Your HEW has been notified. Please attend your next ANC visit.',
  },
  monitoring: {
    emoji: '🟡',
    label: 'Needs Closer Monitoring',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    sub: 'Attend all ANC contacts and report any new symptoms.',
  },
  low: {
    emoji: '🟢',
    label: 'Low-Risk Pregnancy',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    sub: 'Keep up with your ANC schedule and stay active.',
  },
};

export default function RiskBadge({ level, factors = [] }: Props) {
  const c = CONFIG[level];
  return (
    <div className={`border rounded-2xl p-4 ${c.bg}`}>
      <p className={`font-semibold ${c.text}`}>
        {c.emoji} {c.label}
      </p>
      <p className={`text-sm mt-1 ${c.text} opacity-75`}>{c.sub}</p>
      {factors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {factors.map((f) => (
            <span
              key={f}
              className={`text-xs px-2 py-0.5 rounded-full border ${c.bg} ${c.text}`}
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
