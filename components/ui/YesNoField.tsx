'use client';

import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

export default function YesNoField({
  label,
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {[
          [yesLabel, true],
          [noLabel, false],
        ].map(([opt, val]) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(val as boolean)}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
              value === val
                ? ds.navPillActive + ' border-teal-600'
                : ds.navPillInactive
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
