import { ANC_CONTACTS } from '@/data/ancContacts';
import type { ANCContact, ANCAlertLevel } from './types';

export function calcEDD(lmp: string): string {
  const d = new Date(lmp);
  d.setDate(d.getDate() + 280);
  return d.toISOString().slice(0, 10);
}

export function getContactDueDate(lmp: string, recommendedWeek: number): Date {
  const d = new Date(lmp);
  d.setDate(d.getDate() + recommendedWeek * 7);
  return d;
}

export function getANCAlertLevel(
  lmp: string,
  recommendedWeek: number,
  completed: boolean
): { level: ANCAlertLevel; daysOverdue: number } {
  if (completed || !lmp) {
    return { level: 'none', daysOverdue: 0 };
  }

  const due = getContactDueDate(lmp, recommendedWeek);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const daysOverdue = Math.floor(
    (today.getTime() - due.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (daysOverdue < 7) {
    return { level: 'none', daysOverdue: Math.max(0, daysOverdue) };
  }
  if (daysOverdue >= 21) return { level: 'red', daysOverdue };
  if (daysOverdue >= 14) return { level: 'orange', daysOverdue };
  return { level: 'yellow', daysOverdue };
}

const ALERT_RANK: Record<ANCAlertLevel, number> = {
  none: 0,
  yellow: 1,
  orange: 2,
  red: 3,
};

export function getHighestANCAlert(
  lmp: string,
  ancContacts: ANCContact[]
): { level: ANCAlertLevel; contactId: number | null; daysOverdue: number } {
  let highest: ANCAlertLevel = 'none';
  let contactId: number | null = null;
  let daysOverdue = 0;

  for (const contact of ANC_CONTACTS) {
    const saved = ancContacts.find((c) => c.id === contact.id);
    if (saved?.completed) continue;

    const { level, daysOverdue: days } = getANCAlertLevel(
      lmp,
      contact.recommendedWeek,
      false
    );

    if (ALERT_RANK[level] > ALERT_RANK[highest]) {
      highest = level;
      contactId = contact.id;
      daysOverdue = days;
    }
  }

  return { level: highest, contactId, daysOverdue };
}

export const ANC_ALERT_STYLES: Record<
  ANCAlertLevel,
  { badge: string; label: string }
> = {
  none: { badge: '', label: '' },
  yellow: {
    badge: 'bg-amber-100 text-amber-800',
    label: 'Overdue 7+ days',
  },
  orange: {
    badge: 'bg-orange-100 text-orange-800',
    label: 'Overdue 14+ days',
  },
  red: {
    badge: 'bg-rose-100 text-rose-800',
    label: 'Overdue 21+ days — urgent',
  },
};
