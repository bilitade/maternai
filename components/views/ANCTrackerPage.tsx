'use client';

import { useState } from 'react';
import type { ANCContact, ANCContactDef, ANCAlertLevel } from '@/lib/types';
import { ANC_CONTACTS } from '@/data/ancContacts';
import { getANCAlertLevel } from '@/lib/ancLogic';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { saveANCContacts } from '@/lib/motherApi';
import ANCContactCard from '@/components/ui/ANCContactCard';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getAncFocus } from '@/lib/locale/content';
import { VIEW_PATH } from '@/lib/routes';
import type { MessageKey } from '@/lib/i18n';

type ContactStatus = 'completed' | 'overdue' | 'upcoming' | 'future';

function getStatus(
  contact: ANCContactDef,
  lmp: string | undefined,
  saved: ANCContact[]
): { status: ContactStatus; alertLevel: ANCAlertLevel; daysOverdue: number } {
  const record = saved.find((c) => c.id === contact.id);
  if (record?.completed) {
    return { status: 'completed', alertLevel: 'none', daysOverdue: 0 };
  }

  if (lmp) {
    const { level, daysOverdue } = getANCAlertLevel(
      lmp,
      contact.recommendedWeek,
      false
    );
    if (level !== 'none') {
      return { status: 'overdue', alertLevel: level, daysOverdue };
    }
  }

  const currentWeeks = lmp
    ? Math.floor(
        (Date.now() - new Date(lmp).getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
    : 0;

  if (currentWeeks >= contact.recommendedWeek - 2) {
    return { status: 'upcoming', alertLevel: 'none', daysOverdue: 0 };
  }
  return { status: 'future', alertLevel: 'none', daysOverdue: 0 };
}

const STATUS_KEYS: Record<ContactStatus, MessageKey> = {
  completed: 'ancStatusCompleted',
  overdue: 'ancStatusOverdue',
  upcoming: 'ancStatusUpcoming',
  future: 'ancStatusFuture',
};

const ALERT_KEYS: Record<ANCAlertLevel, MessageKey | null> = {
  none: null,
  yellow: 'ancAlertYellow',
  orange: 'ancAlertOrange',
  red: 'ancAlertRed',
};

export default function ANCTrackerPage() {
  const { t, tf, locale } = useLocale();
  const { profile, ancContacts, patchLocal } = useMotherData();
  const [saving, setSaving] = useState<number | null>(null);
  const currentWeeks = profile?.gestationalAgeWeeks ?? 0;

  useMotherPageHeader({
    title: t('ancTitle'),
    subtitle: tf('ancSubtitle', { weeks: currentWeeks }),
    backHref: VIEW_PATH.motherDashboard,
    backLabel: t('dashboard'),
  });

  const handleMarkComplete = async (id: number) => {
    const contact: ANCContact = {
      id,
      completed: true,
      completedDate: new Date().toISOString().slice(0, 10),
      missed: false,
      missedSince: null,
    };
    setSaving(id);
    try {
      const updated = [...ancContacts.filter((c) => c.id !== id), contact];
      await saveANCContacts(updated);
      patchLocal({ ancContacts: updated });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {ANC_CONTACTS.map((contact) => {
        const { status, alertLevel, daysOverdue } = getStatus(
          contact,
          profile?.lmp,
          ancContacts
        );
        const savedContact = ancContacts.find((c) => c.id === contact.id);
        const alertKey = ALERT_KEYS[alertLevel];
        const localizedContact = {
          ...contact,
          focus: getAncFocus(locale, contact.id) || contact.focus,
        };

        return (
          <div key={contact.id}>
            <ANCContactCard
              contact={localizedContact}
              status={status}
              statusLabel={t(STATUS_KEYS[status])}
              statusClassName={
                status === 'completed'
                  ? 'bg-teal-100 text-teal-700'
                  : status === 'overdue'
                    ? 'bg-amber-100 text-amber-800'
                    : status === 'upcoming'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-slate-100 text-slate-500'
              }
              completedDate={savedContact?.completedDate}
              alertLevel={alertLevel}
              alertLabel={alertKey ? t(alertKey) : ''}
              daysOverdue={daysOverdue}
              onMarkComplete={() => handleMarkComplete(contact.id)}
              showMarkButton={status !== 'completed' && saving !== contact.id}
              markLabel={
                saving === contact.id ? t('ancSaving') : t('ancMarkDone')
              }
              weekLabel={tf('ancByWeek', { week: contact.recommendedWeek })}
              completedOnLabel={
                savedContact?.completedDate
                  ? tf('ancCompletedOn', { date: savedContact.completedDate })
                  : undefined
              }
            />

            {status === 'overdue' && alertKey && (
              <div className="ml-4 mt-2 border-l-2 border-amber-400 pl-3">
                <p className="text-xs text-slate-600">
                  {tf('ancOverdueNote', { label: t(alertKey) })}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
