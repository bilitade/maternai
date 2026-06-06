'use client';

import type { ANCContactDef, ANCAlertLevel } from '@/lib/types';
import { ANC_ALERT_STYLES } from '@/lib/ancLogic';
import Card, { Button } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface Props {
  contact: ANCContactDef;
  status: 'completed' | 'overdue' | 'upcoming' | 'future';
  statusLabel: string;
  statusClassName: string;
  completedDate?: string | null;
  alertLevel?: ANCAlertLevel;
  alertLabel?: string;
  daysOverdue?: number;
  onMarkComplete: () => void;
  showMarkButton: boolean;
  markLabel?: string;
  weekLabel?: string;
  completedOnLabel?: string;
}

export default function ANCContactCard({
  contact,
  statusLabel,
  statusClassName,
  completedDate,
  alertLevel = 'none',
  alertLabel,
  daysOverdue,
  onMarkComplete,
  showMarkButton,
  markLabel = 'Mark as Completed',
  weekLabel,
  completedOnLabel,
}: Props) {
  const alertStyle = ANC_ALERT_STYLES[alertLevel];

  return (
    <Card hover padding>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{contact.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {weekLabel ?? `By week ${contact.recommendedWeek}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full',
              statusClassName
            )}
          >
            {statusLabel}
          </span>
          {alertLevel !== 'none' && alertLabel && (
            <span
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full',
                alertStyle.badge
              )}
            >
              {daysOverdue}d · {alertLabel}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{contact.focus}</p>
      {completedDate && (
        <p className="text-xs text-teal-700 mt-2 font-medium">
          {completedOnLabel ?? `Completed on ${completedDate}`}
        </p>
      )}
      {showMarkButton && (
        <Button onClick={onMarkComplete} fullWidth className="mt-4">
          {markLabel}
        </Button>
      )}
    </Card>
  );
}
