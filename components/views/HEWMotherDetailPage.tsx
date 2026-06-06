'use client';

import { useState } from 'react';
import type { AppView, DemoMother, MotherFlag } from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { getProfile, saveHEWVisit } from '@/lib/storage';
import { getMotherAIHistory } from '@/lib/hewHelpers';
import RiskBadge from '@/components/ui/RiskBadge';
import AISourceBadge from '@/components/ui/AISourceBadge';
import HEWLayout from '@/components/layout/HEWLayout';
import Card, { Button } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  mother: DemoMother | null;
  navigate: (view: AppView) => void;
}

const FLAG_STYLES: Record<MotherFlag, string> = {
  danger_sign: 'bg-rose-50 border-rose-200 text-rose-800',
  missed_anc: 'bg-amber-50 border-amber-200 text-amber-800',
  nutrition_concern: 'bg-orange-50 border-orange-200 text-orange-800',
  wellness_concern: 'bg-sky-50 border-sky-200 text-sky-800',
};

const FLAG_LABELS: Record<MotherFlag, string> = {
  danger_sign: 'Danger sign reported — act today',
  missed_anc: 'Missed ANC contact — schedule home visit',
  nutrition_concern: 'Nutrition concern — send dietary guidance',
  wellness_concern: 'Wellness concern — weekly follow-up call',
};

export default function HEWMotherDetailPage({ mother, navigate }: Props) {
  const [visitLogged, setVisitLogged] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [escalated, setEscalated] = useState(false);

  if (!mother) {
    return (
      <HEWLayout
        navigate={navigate}
        title="Mother Detail"
        subtitle="No mother selected"
        onBack={() => navigate('hewDashboard')}
      >
        <div className="flex items-center justify-center py-20">
          <button
            type="button"
            onClick={() => navigate('hewDashboard')}
            className={cn('text-sm font-medium hover:underline', ds.brandText)}
          >
            Back to dashboard
          </button>
        </div>
      </HEWLayout>
    );
  }

  const handleLogVisit = () => {
    saveHEWVisit({
      motherId: mother.id,
      date: new Date().toISOString(),
    });
    setVisitLogged(true);
  };

  const profile = getProfile();
  const isLiveMother = profile?.id === mother.id;
  const { danger, insights } = isLiveMother
    ? getMotherAIHistory()
    : { danger: null, insights: [] };

  return (
    <HEWLayout
      navigate={navigate}
      title={mother.name}
      subtitle={`Week ${mother.gestationalAgeWeeks} · ${mother.kebele}`}
      onBack={() => navigate('hewDashboard')}
      backLabel="Dashboard"
      headerActions={
        <button
          type="button"
          onClick={() => navigate('roleSelect')}
          className={ds.headerAction}
        >
          Switch role
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <RiskBadge level={mother.riskLevel} factors={mother.riskFactors} />

          <Card>
            <p className="text-sm font-medium text-slate-700 mb-4">
              ANC Timeline
            </p>
            <div className="flex justify-between gap-2 max-w-lg">
              {ANC_CONTACTS.map((contact) => {
                const completed = mother.ancCompleted.includes(contact.id);
                const missed =
                  !completed &&
                  mother.gestationalAgeWeeks > contact.recommendedWeek + 2;
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
                          : missed
                            ? 'bg-rose-500 text-white'
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

          {mother.flags.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className={ds.sectionLabel}>Active flags</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mother.flags.map((flag) => (
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

          {isLiveMother && danger && danger.signs.length > 0 && (
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

          {isLiveMother && insights.length > 0 && (
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
        </div>

        <div className="flex flex-col gap-3">
          <p className={ds.sectionLabel}>Actions</p>
          <Button onClick={handleLogVisit} disabled={visitLogged} fullWidth>
            {visitLogged ? 'Visit logged ✓' : 'Log Home Visit'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setReminderSent(true)}
            disabled={reminderSent}
            fullWidth
          >
            {reminderSent
              ? `Reminder sent to ${mother.name} ✓`
              : 'Send Reminder'}
          </Button>
          <Button
            variant="danger"
            onClick={() => setEscalated(true)}
            disabled={escalated}
            fullWidth
          >
            {escalated
              ? 'Escalated — health center notified ✓'
              : 'Escalate to Health Center'}
          </Button>
        </div>
      </div>
    </HEWLayout>
  );
}
