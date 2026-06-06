'use client';

import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { saveDeliveryPrepState } from '@/lib/motherApi';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getDeliveryChecklist } from '@/lib/locale/content';
import { VIEW_PATH } from '@/lib/routes';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';

export default function DeliveryPrepPage() {
  const { t, tf, locale } = useLocale();
  const { profile, deliveryPrep, patchLocal } = useMotherData();
  const weeks = profile?.gestationalAgeWeeks ?? 0;
  const checklist = getDeliveryChecklist(locale);
  const checked = useMemo(() => new Set(deliveryPrep), [deliveryPrep]);
  const [saving, setSaving] = useState(false);

  const progress = (checked.size / checklist.length) * 100;

  useMotherPageHeader({
    title: t('deliveryTitle'),
    subtitle:
      weeks < 32
        ? t('deliverySubtitle')
        : tf('deliveryProgress', { pct: Math.round(progress) }),
    backHref: VIEW_PATH.motherDashboard,
    backLabel: t('dashboard'),
  });

  const toggle = async (index: number) => {
    const next = new Set(checked);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    const arr = [...next];
    patchLocal({ deliveryPrep: arr });
    setSaving(true);
    try {
      await saveDeliveryPrepState(arr);
    } finally {
      setSaving(false);
    }
  };

  if (weeks < 32) {
    return (
      <div className="flex items-center justify-center py-12 lg:py-20">
        <Card className="text-center max-w-md w-full py-10">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-slate-500" strokeWidth={1.75} />
          </div>
          <p className="font-semibold text-slate-900 text-lg">{t('deliveryLocked')}</p>
          <p className="text-sm text-slate-600 mt-2">
            {tf('deliveryLockedBody', { weeks: 32 - weeks })}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Card>
        <p className="text-sm font-medium text-slate-800 mb-4">
          {t('deliveryChecklistIntro')}
        </p>
        <ul className="flex flex-col gap-3">
          {checklist.map((item, i) => (
            <li key={item}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked.has(i)}
                  onChange={() => toggle(i)}
                  disabled={saving}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span
                  className={cn(
                    'text-sm leading-relaxed transition-colors',
                    checked.has(i)
                      ? 'text-teal-800 font-medium'
                      : 'text-slate-700 group-hover:text-slate-900'
                  )}
                >
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
