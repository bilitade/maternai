'use client';

import { useState } from 'react';
import type { AppView, ANCContact, ANCContactDef } from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { getProfile, getANCContacts, saveANCContact } from '@/lib/storage';
import ANCContactCard from '@/components/ui/ANCContactCard';
import MotherLayout from '@/components/layout/MotherLayout';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

type ContactStatus = 'completed' | 'missed' | 'upcoming' | 'future';

function getStatus(
  contact: ANCContactDef,
  currentWeeks: number,
  saved: ANCContact[]
): ContactStatus {
  const s = saved.find((c) => c.id === contact.id);
  if (s?.completed) return 'completed';
  if (currentWeeks > contact.recommendedWeek + 2) return 'missed';
  if (currentWeeks >= contact.recommendedWeek - 2) return 'upcoming';
  return 'future';
}

const STATUS_STYLES: Record<
  ContactStatus,
  { className: string; label: string }
> = {
  completed: {
    className: 'bg-teal-100 text-teal-700',
    label: 'Completed',
  },
  missed: { className: 'bg-rose-100 text-rose-700', label: 'Missed' },
  upcoming: { className: 'bg-sky-100 text-sky-700', label: 'Upcoming' },
  future: { className: 'bg-slate-100 text-slate-500', label: 'Scheduled' },
};

export default function ANCTrackerPage({ navigate, currentView }: Props) {
  const profile = getProfile();
  const [saved, setSaved] = useState(() => getANCContacts());
  const currentWeeks = profile?.gestationalAgeWeeks ?? 20;

  const handleMarkComplete = (id: number) => {
    const contact: ANCContact = {
      id,
      completed: true,
      completedDate: new Date().toISOString().slice(0, 10),
      missed: false,
      missedSince: null,
    };
    saveANCContact(contact);
    setSaved((prev) => [...prev.filter((c) => c.id !== id), contact]);
  };

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="ANC Tracker"
      subtitle={`WHO 8-contact model · Week ${currentWeeks} of pregnancy`}
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ANC_CONTACTS.map((contact) => {
          const status = getStatus(contact, currentWeeks, saved);
          const style = STATUS_STYLES[status];
          const savedContact = saved.find((c) => c.id === contact.id);

          return (
            <div key={contact.id}>
              <ANCContactCard
                contact={contact}
                status={status}
                statusLabel={style.label}
                statusClassName={style.className}
                completedDate={savedContact?.completedDate}
                onMarkComplete={() => handleMarkComplete(contact.id)}
                showMarkButton={status !== 'completed'}
              />

              {status === 'missed' && (
                <div className="ml-4 mt-2 border-l-2 border-amber-400 pl-3 flex flex-col gap-1.5">
                  {[
                    {
                      day: 'Day 1',
                      text: 'SMS reminder sent to mother',
                      done: true,
                    },
                    {
                      day: 'Day 7',
                      text: 'HEW notification scheduled',
                      done: false,
                    },
                    { day: 'Day 14', text: 'Home visit flagged', done: false },
                    {
                      day: 'Day 21',
                      text: 'Health center alert',
                      done: false,
                    },
                  ].map(({ day, text, done }) => (
                    <p key={day} className="text-xs text-gray-600">
                      <span className="font-medium">{day}</span> — {text}{' '}
                      <span>{done ? '✓' : '⏳'}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MotherLayout>
  );
}
