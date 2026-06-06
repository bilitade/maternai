'use client';

import { useState } from 'react';
import type { AppView, DemoMother, MotherFlag } from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { saveHEWVisit } from '@/lib/storage';
import RiskBadge from '@/components/ui/RiskBadge';
import HEWLayout from '@/components/layout/HEWLayout';

interface Props {
  mother: DemoMother | null;
  navigate: (view: AppView) => void;
}

const FLAG_STYLES: Record<MotherFlag, string> = {
  danger_sign: 'bg-red-50 border-red-200 text-red-800',
  missed_anc: 'bg-amber-50 border-amber-200 text-amber-800',
  nutrition_concern: 'bg-orange-50 border-orange-200 text-orange-800',
  wellness_concern: 'bg-blue-50 border-blue-200 text-blue-800',
};

const FLAG_LABELS: Record<MotherFlag, string> = {
  danger_sign: '🔴 Danger sign reported — act today',
  missed_anc: '🟠 Missed ANC contact — schedule home visit',
  nutrition_concern: '🟡 Nutrition concern — send dietary guidance',
  wellness_concern: '🔵 Wellness concern — weekly follow-up call',
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
            onClick={() => navigate('hewDashboard')}
            className="text-emerald-600 text-sm font-medium hover:underline"
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

  return (
    <HEWLayout
      navigate={navigate}
      title={mother.name}
      subtitle={`Week ${mother.gestationalAgeWeeks} · ${mother.kebele}`}
      onBack={() => navigate('hewDashboard')}
      backLabel="Dashboard"
      headerActions={
        <button
          onClick={() => navigate('roleSelect')}
          className="text-sm text-emerald-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-600"
        >
          Switch role
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <RiskBadge level={mother.riskLevel} factors={mother.riskFactors} />

          <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-4">
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
                      className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-xs font-medium
                        ${
                          completed
                            ? 'bg-emerald-500 text-white'
                            : missed
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {contact.id}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      W{contact.recommendedWeek}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {mother.flags.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Active flags</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mother.flags.map((flag) => (
                  <div
                    key={flag}
                    className={`border rounded-2xl p-3 text-sm ${FLAG_STYLES[flag]}`}
                  >
                    {FLAG_LABELS[flag]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Actions
          </p>
          <button
            onClick={handleLogVisit}
            disabled={visitLogged}
            className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all w-full disabled:opacity-60"
          >
            {visitLogged ? 'Visit logged ✓' : 'Log Home Visit'}
          </button>
          <button
            onClick={() => setReminderSent(true)}
            disabled={reminderSent}
            className="border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors w-full disabled:opacity-60 bg-white"
          >
            {reminderSent
              ? `Reminder sent to ${mother.name} ✓`
              : 'Send Reminder'}
          </button>
          <button
            onClick={() => setEscalated(true)}
            disabled={escalated}
            className="bg-red-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-red-700 active:scale-95 transition-all w-full disabled:opacity-60"
          >
            {escalated
              ? 'Escalated — health center notified ✓'
              : 'Escalate to Health Center'}
          </button>
        </div>
      </div>
    </HEWLayout>
  );
}
