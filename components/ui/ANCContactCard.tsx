'use client';

import type { ANCContactDef } from '@/lib/types';

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{contact.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Week {contact.recommendedWeek}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClassName}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2">{contact.focus}</p>
      {completedDate && (
        <p className="text-xs text-emerald-600 mt-2">
          Completed on {completedDate}
        </p>
      )}
      {showMarkButton && (
        <button
          onClick={onMarkComplete}
          className="mt-3 bg-emerald-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all w-full"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
}
