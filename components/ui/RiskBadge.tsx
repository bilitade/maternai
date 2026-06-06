'use client';

import type { RiskLevel } from '@/lib/types';
import { cn } from '@/lib/cn';

interface Props {
  level: RiskLevel;
  factors?: string[];
}

const CONFIG: Record<
  RiskLevel,
  { label: string; dot: string; bg: string; text: string; sub: string; chip: string }
> = {
  high: {
    dot: 'bg-rose-500',
    label: 'High-Risk Pregnancy',
    bg: 'bg-rose-50/80 border-rose-200',
    text: 'text-rose-900',
    sub: 'Your HEW has been notified. Please attend your next ANC visit.',
    chip: 'bg-white/60 border-rose-200 text-rose-800',
  },
  monitoring: {
    dot: 'bg-amber-500',
    label: 'Needs Closer Monitoring',
    bg: 'bg-amber-50/80 border-amber-200',
    text: 'text-amber-900',
    sub: 'Attend all ANC contacts and report any new symptoms.',
    chip: 'bg-white/60 border-amber-200 text-amber-800',
  },
  low: {
    dot: 'bg-teal-500',
    label: 'Low-Risk Pregnancy',
    bg: 'bg-teal-50/80 border-teal-200',
    text: 'text-teal-900',
    sub: 'Keep up with your ANC schedule and stay active.',
    chip: 'bg-white/60 border-teal-200 text-teal-800',
  },
};

export default function RiskBadge({ level, factors = [] }: Props) {
  const c = CONFIG[level];
  return (
    <div className={cn('border rounded-2xl p-5', c.bg)}>
      <div className="flex items-center gap-2.5">
        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', c.dot)} />
        <p className={cn('font-semibold', c.text)}>{c.label}</p>
      </div>
      <p className={cn('text-sm mt-2 leading-relaxed', c.text, 'opacity-80')}>
        {c.sub}
      </p>
      {factors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {factors.map((f) => (
            <span
              key={f}
              className={cn('text-xs px-2.5 py-1 rounded-full border', c.chip)}
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
