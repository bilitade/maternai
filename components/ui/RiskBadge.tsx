'use client';

import type { RiskLevel } from '@/lib/types';
import { useLocale } from '@/components/providers/LocaleProvider';
import type { MessageKey } from '@/lib/i18n';
import { cn } from '@/lib/cn';

interface Props {
  level: RiskLevel;
  factors?: string[];
}

const LEVEL_KEYS: Record<RiskLevel, MessageKey> = {
  high: 'riskHigh',
  monitoring: 'riskMonitoring',
  low: 'riskLow',
};

const CONFIG: Record<
  RiskLevel,
  { dot: string; bg: string; text: string; chip: string }
> = {
  high: {
    dot: 'bg-rose-500',
    bg: 'bg-rose-50/80 border-rose-200',
    text: 'text-rose-900',
    chip: 'bg-white/60 border-rose-200 text-rose-800',
  },
  monitoring: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50/80 border-amber-200',
    text: 'text-amber-900',
    chip: 'bg-white/60 border-amber-200 text-amber-800',
  },
  low: {
    dot: 'bg-teal-500',
    bg: 'bg-teal-50/80 border-teal-200',
    text: 'text-teal-900',
    chip: 'bg-white/60 border-teal-200 text-teal-800',
  },
};

export default function RiskBadge({ level, factors = [] }: Props) {
  const { t } = useLocale();
  const c = CONFIG[level];
  return (
    <div className={cn('border rounded-2xl p-5', c.bg)}>
      <div className="flex items-center gap-2.5">
        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', c.dot)} />
        <p className={cn('font-semibold', c.text)}>{t(LEVEL_KEYS[level])}</p>
      </div>
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
