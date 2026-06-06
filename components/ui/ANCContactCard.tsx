'use client';

import type { ANCContactDef } from '@/lib/types';
import Card, { Button } from '@/components/ui/Card';

interface Props {
  contact: ANCContactDef;
  status: 'completed' | 'missed' | 'upcoming' | 'future';
  statusLabel: string;
  statusClassName: string;
  completedDate?: string | null;
  onMarkComplete: () => void;
  showMarkButton: boolean;
}

export default function ANCContactCard({
  contact,
  statusLabel,
  statusClassName,
  completedDate,
  onMarkComplete,
  showMarkButton,
}: Props) {
  return (
    <Card hover padding>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{contact.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Week {contact.recommendedWeek}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClassName}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{contact.focus}</p>
      {completedDate && (
        <p className="text-xs text-teal-700 mt-2 font-medium">
          Completed on {completedDate}
        </p>
      )}
      {showMarkButton && (
        <Button onClick={onMarkComplete} fullWidth className="mt-4">
          Mark as Completed
        </Button>
      )}
    </Card>
  );
}
