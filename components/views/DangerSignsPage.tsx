'use client';

import { useState } from 'react';
import {
  Droplets,
  Zap,
  Eye,
  Activity,
  Baby,
  AlertCircle,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { saveAIInsights, saveDangerReports } from '@/lib/motherApi';
import { analyzeDangerSigns } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getDangerSigns } from '@/lib/locale/content';
import { VIEW_PATH } from '@/lib/routes';
import Card, { Button } from '@/components/ui/Card';
import AIResponsePanel from '@/components/ai/AIResponsePanel';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import type { AIResult } from '@/lib/ai';

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Droplets,
  Zap,
  Eye,
  Activity,
  Baby,
  AlertCircle,
  Thermometer,
  Wind,
};

function isUrgentSelection(selected: Set<string>): boolean {
  return (
    selected.has('bleeding') ||
    (selected.has('headache') && selected.has('vision')) ||
    selected.has('convulsions')
  );
}

export default function DangerSignsPage() {
  const { t, locale } = useLocale();
  const { profile, dangerReports, aiInsights, patchLocal } = useMotherData();
  const signs = getDangerSigns(locale);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [clearMessage, setClearMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiPromise, setAiPromise] = useState<Promise<AIResult> | null>(null);

  useMotherPageHeader({
    title: t('dangerTitle'),
    subtitle: t('dangerSubtitle'),
    backHref: VIEW_PATH.motherDashboard,
    backLabel: t('dashboard'),
  });

  const toggleSign = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
    setClearMessage(false);
    setErrorMessage(null);
    setAiPromise(null);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setClearMessage(false);
    setAiPromise(null);

    if (selected.size === 0) {
      setClearMessage(true);
      return;
    }

    const aiLabels = signs
      .filter((s) => selected.has(s.id))
      .map((s) => s.aiLabel);
    const weeks = profile?.gestationalAgeWeeks ?? 20;
    const urgent = isUrgentSelection(selected);

    setLoading(true);
    const promise = analyzeDangerSigns(aiLabels, weeks, locale)
      .then(async (result) => {
        const now = new Date().toISOString();
        const report = {
          id: crypto.randomUUID(),
          date: now,
          signs: aiLabels,
          response: result.text,
          urgent,
          source: result.source,
        };
        const insight = {
          type: 'danger' as const,
          text: result.text,
          source: result.source,
          date: now,
          meta: { signs: aiLabels, urgent },
        };
        await saveDangerReports([...dangerReports, report]);
        await saveAIInsights([...aiInsights.slice(-19), insight]);
        patchLocal({
          dangerReports: [...dangerReports, report],
          aiInsights: [...aiInsights.slice(-19), insight],
        });
        return result;
      })
      .catch(() => {
        setErrorMessage(t('aiError'));
        return { text: t('aiError'), source: 'offline' as const };
      })
      .finally(() => setLoading(false));

    setAiPromise(promise);
  };

  const isUrgent = isUrgentSelection(selected);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {signs.map((sign) => {
            const Icon = ICON_MAP[sign.icon];
            const isSelected = selected.has(sign.id);
            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => toggleSign(sign.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-rose-50 border-2 border-rose-300 text-rose-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                )}
              >
                {Icon && <Icon size={16} />}
                {sign.label}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto sm:min-w-[200px]"
        >
          {loading ? t('dangerChecking') : t('dangerCheckBtn')}
        </Button>
      </div>

      <div className="flex-1 max-w-xl flex flex-col gap-3">
        {clearMessage && (
          <div className={ds.alertSuccess}>
            <p className={ds.alertSuccessText}>{t('dangerClear')}</p>
          </div>
        )}

        <AIResponsePanel
          promise={aiPromise}
          loading={loading}
          loadingMessage={t('dangerChecking')}
          title={t('dangerAiTitle')}
          errorMessage={errorMessage ?? undefined}
          variant={isUrgent ? 'danger' : 'warning'}
          footer={`${t('dangerSavedNote')} ${t('dangerDisclaimer')}`}
        />

        {!clearMessage && !aiPromise && !loading && !errorMessage && (
          <Card className="hidden lg:block text-sm text-slate-500 leading-relaxed">
            {t('dangerHint')}
          </Card>
        )}
      </div>
    </div>
  );
}
