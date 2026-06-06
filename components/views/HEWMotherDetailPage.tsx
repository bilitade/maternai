'use client';

import { useEffect, useState } from 'react';
import type {
  DemoMother,
  MotherFlag,
  AIInsight,
  DangerSignReport,
  HewAction,
  HewActionType,
} from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { ANC_ALERT_STYLES } from '@/lib/ancLogic';
import RiskBadge from '@/components/ui/RiskBadge';
import AISourceBadge from '@/components/ui/AISourceBadge';
import HEWLayout from '@/components/layout/HEWLayout';
import Card, { Button } from '@/components/ui/Card';
import { inputClassName, labelClassName } from '@/components/ui/FormField';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  motherId: string;
  onBack: () => void;
  onLogout?: () => void;
}

interface MotherDetailData {
  summary: DemoMother;
  dangerReports: DangerSignReport[];
  aiInsights: AIInsight[];
  hewActions: HewAction[];
}

const FLAG_STYLES: Record<MotherFlag, string> = {
  danger_sign: 'bg-rose-50 border-rose-200 text-rose-800',
  missed_anc: 'bg-amber-50 border-amber-200 text-amber-800',
  nutrition_concern: 'bg-orange-50 border-orange-200 text-orange-800',
  wellness_concern: 'bg-sky-50 border-sky-200 text-sky-800',
};

const FLAG_LABELS: Record<MotherFlag, string> = {
  danger_sign: 'Danger sign reported — act today',
  missed_anc: 'Missed ANC — trace and follow up',
  nutrition_concern: 'Nutrition concern — send dietary guidance',
  wellness_concern: 'Wellness concern — weekly follow-up call',
};

const TRACE_ACTIONS: {
  type: HewActionType;
  label: string;
  variant?: 'secondary' | 'danger';
  needsNote?: boolean;
}[] = [
  { type: 'phone_call', label: 'Log phone call' },
  { type: 'visit', label: 'Log home visit' },
  { type: 'trace', label: 'Document trace attempt', needsNote: true },
  { type: 'reminder', label: 'Send reminder' },
  { type: 'returned_to_care', label: 'Returned to care' },
  { type: 'referral', label: 'Referred to facility' },
  { type: 'escalate', label: 'Escalate to health center', variant: 'danger' },
];

async function postAction(
  motherId: string,
  type: HewActionType,
  notes?: string
) {
  const res = await fetch(`/api/hew/mothers/${motherId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, notes }),
  });
  if (!res.ok) throw new Error('Action failed');
  return res.json();
}

export default function HEWMotherDetailPage({ motherId, onBack, onLogout }: Props) {
  const [detail, setDetail] = useState<MotherDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [traceNotes, setTraceNotes] = useState('');

  const reload = async (id: string) => {
    const res = await fetch(`/api/hew/mothers/${id}`, { cache: 'no-store' });
    if (res.ok) setDetail(await res.json());
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await reload(motherId);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [motherId]);

  const display = detail?.summary;
  const danger = detail?.dangerReports?.[detail.dangerReports.length - 1];
  const insights = [...(detail?.aiInsights ?? [])].reverse().slice(0, 5);
  const actions = detail?.hewActions ?? [];
  const ancAlert = display?.ancAlertLevel ?? 'none';
  const alertStyle = ANC_ALERT_STYLES[ancAlert];

  const runAction = async (type: HewActionType, needsNote?: boolean) => {
    if (needsNote && !traceNotes.trim()) return;
    setActionLoading(type);
    try {
      await postAction(motherId, type, needsNote ? traceNotes.trim() : undefined);
      if (needsNote) setTraceNotes('');
      await reload(motherId);
    } finally {
      setActionLoading(null);
    }
  };

  const hasAction = (type: HewActionType) => actions.some((a) => a.type === type);

  return (
    <HEWLayout
      title={display?.name ?? 'Mother Detail'}
      subtitle={
        display
          ? `Week ${display.gestationalAgeWeeks} · ${display.kebele}`
          : 'Loading...'
      }
      onBack={onBack}
      backLabel="Dashboard"
      headerActions={
        onLogout ? (
          <button type="button" onClick={onLogout} className={ds.headerAction}>
            Sign out
          </button>
        ) : undefined
      }
    >
      {loading ? (
        <p className="text-sm text-slate-500">Loading mother record...</p>
      ) : !display ? (
        <p className="text-sm text-slate-500">Mother record not found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <RiskBadge level={display.riskLevel} factors={display.riskFactors} />

            {ancAlert !== 'none' && (
              <div className={cn('rounded-2xl border p-4', alertStyle.badge)}>
                <p className="text-sm font-semibold">
                  ANC alert: {alertStyle.label}
                </p>
                {display.ancDaysOverdue !== undefined && (
                  <p className="text-xs mt-1 opacity-90">
                    {display.ancDaysOverdue} days overdue
                    {display.ancOverdueContact
                      ? ` · ANC ${display.ancOverdueContact}`
                      : ''}
                  </p>
                )}
              </div>
            )}

            <Card>
              <p className="text-sm font-medium text-slate-700 mb-4">
                ANC Timeline
              </p>
              <div className="flex justify-between gap-2 max-w-lg">
                {ANC_CONTACTS.map((contact) => {
                  const completed = display.ancCompleted.includes(contact.id);
                  const overdue =
                    !completed &&
                    display.ancOverdueContact === contact.id &&
                    ancAlert !== 'none';
                  return (
                    <div
                      key={contact.id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={cn(
                          'w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-xs font-medium',
                          completed
                            ? 'bg-teal-500 text-white'
                            : overdue
                              ? ancAlert === 'red'
                                ? 'bg-rose-500 text-white'
                                : ancAlert === 'orange'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-amber-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        )}
                      >
                        {contact.id}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        W{contact.recommendedWeek}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {display.flags.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className={ds.sectionLabel}>Active flags</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {display.flags.map((flag) => (
                    <div
                      key={flag}
                      className={cn(
                        'border rounded-2xl p-3 text-sm leading-snug',
                        FLAG_STYLES[flag]
                      )}
                    >
                      {FLAG_LABELS[flag]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {danger && danger.signs.length > 0 && (
              <Card className="border-rose-200 bg-rose-50/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-rose-900">
                    AI danger sign report
                  </p>
                  <AISourceBadge source={danger.source} />
                </div>
                <p className="text-xs text-rose-700 mb-2">
                  Reported: {danger.signs.join(', ')} ·{' '}
                  {new Date(danger.date).toLocaleString()}
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {danger.response}
                </p>
              </Card>
            )}

            {insights.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className={ds.sectionLabel}>Recent AI activity</p>
                {insights.map((insight, i) => (
                  <Card key={i} padding className="!p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-slate-500 capitalize">
                        {insight.type}
                      </p>
                      <AISourceBadge source={insight.source} />
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {insight.text}
                    </p>
                  </Card>
                ))}
              </div>
            )}

            {actions.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className={ds.sectionLabel}>Action history</p>
                {[...actions].reverse().slice(0, 8).map((a) => (
                  <Card key={a.id} padding className="!p-3">
                    <p className="text-xs font-medium text-slate-700 capitalize">
                      {a.type.replace(/_/g, ' ')} ·{' '}
                      {new Date(a.date).toLocaleString()}
                    </p>
                    {a.notes && (
                      <p className="text-xs text-slate-500 mt-1">{a.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className={ds.sectionLabel}>Trace & follow-up</p>
            <div>
              <label className={labelClassName}>
                Reason / notes (for trace attempts)
              </label>
              <textarea
                value={traceNotes}
                onChange={(e) => setTraceNotes(e.target.value)}
                rows={3}
                className={cn(inputClassName, 'resize-none')}
                placeholder="Why visit was missed, trace outcome..."
              />
            </div>
            {TRACE_ACTIONS.map(({ type, label, variant, needsNote }) => (
              <Button
                key={type}
                variant={variant ?? 'secondary'}
                onClick={() => runAction(type, needsNote)}
                disabled={
                  actionLoading !== null ||
                  (!needsNote && hasAction(type)) ||
                  (needsNote && !traceNotes.trim())
                }
                fullWidth
              >
                {actionLoading === type
                  ? 'Saving...'
                  : !needsNote && hasAction(type)
                    ? `${label} ✓`
                    : label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </HEWLayout>
  );
}
