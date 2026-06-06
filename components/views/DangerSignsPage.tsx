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
  Loader2,
} from 'lucide-react';
import type { AppView, DangerSign } from '@/lib/types';
import { getProfile, saveAIInsight, saveDangerSignReport } from '@/lib/storage';
import { analyzeDangerSigns } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import MotherLayout from '@/components/layout/MotherLayout';
import Card, { Button } from '@/components/ui/Card';
import AISourceBadge from '@/components/ui/AISourceBadge';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

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

const DANGER_SIGNS: DangerSign[] = [
  { id: 'bleeding', label: 'Vaginal bleeding', icon: 'Droplets' },
  { id: 'headache', label: 'Severe headache', icon: 'Zap' },
  { id: 'vision', label: 'Blurred vision', icon: 'Eye' },
  { id: 'convulsions', label: 'Convulsions or fits', icon: 'Activity' },
  { id: 'fetal', label: 'Reduced fetal movement', icon: 'Baby' },
  {
    id: 'swelling',
    label: 'Severe facial/hand swelling',
    icon: 'AlertCircle',
  },
  { id: 'fever', label: 'High fever', icon: 'Thermometer' },
  { id: 'breathing', label: 'Difficulty breathing', icon: 'Wind' },
];

function isUrgentSelection(selected: Set<string>): boolean {
  return (
    selected.has('bleeding') ||
    (selected.has('headache') && selected.has('vision')) ||
    selected.has('convulsions')
  );
}

export default function DangerSignsPage({ navigate, currentView }: Props) {
  const { t } = useLocale();
  const profile = getProfile();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<string | null>(null);
  const [resultSource, setResultSource] = useState<'ai' | 'offline' | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const toggleSign = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
    setResult(null);
    setResultSource(null);
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setResult('clear');
      setResultSource(null);
      return;
    }
    setLoading(true);
    try {
      const labels = DANGER_SIGNS.filter((s) => selected.has(s.id)).map(
        (s) => s.label
      );
      const weeks = profile?.gestationalAgeWeeks ?? 20;
      const urgent = isUrgentSelection(selected);
      const { text, source } = await analyzeDangerSigns(labels, weeks);

      const now = new Date().toISOString();
      saveDangerSignReport({
        id: crypto.randomUUID(),
        date: now,
        signs: labels,
        response: text,
        urgent,
        source,
      });
      saveAIInsight({
        type: 'danger',
        text,
        source,
        date: now,
        meta: { signs: labels, urgent },
      });

      setResult(text);
      setResultSource(source);
    } catch {
      setResult('error');
      setResultSource(null);
    } finally {
      setLoading(false);
    }
  };

  const isUrgent = isUrgentSelection(selected);

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Danger Signs"
      subtitle="Select symptoms — AI assesses urgency and alerts your HEW"
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {DANGER_SIGNS.map((sign) => {
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
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Analyzing with AI...' : 'Check Symptoms with AI'}
          </Button>
        </div>

        <div className="flex-1 max-w-xl flex flex-col gap-3">
          {result === 'clear' && (
            <div className={ds.alertSuccess}>
              <p className={ds.alertSuccessText}>
                No danger signs selected. Continue monitoring and attend your
                ANC visits. Contact your HEW if anything changes.
              </p>
            </div>
          )}

          {result === 'error' && (
            <div className={ds.alertDanger}>
              <p className={ds.alertDangerText}>{t('aiError')}</p>
            </div>
          )}

          {result && result !== 'clear' && result !== 'error' && (
            <div
              className={cn(
                'rounded-2xl p-5 border-2',
                isUrgent
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-amber-50 border-amber-300'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  AI assessment
                </p>
                {resultSource && <AISourceBadge source={resultSource} />}
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {result}
              </p>
              {resultSource === 'ai' && (
                <p className="text-xs text-teal-700 mt-3 font-medium">
                  Report saved — your HEW will see this on their dashboard.
                </p>
              )}
              <p className="text-xs text-slate-500 mt-3 border-t border-slate-200/80 pt-2">
                {t('dangerDisclaimer')}
              </p>
            </div>
          )}

          {!result && (
            <Card className="hidden lg:block text-sm text-slate-500 leading-relaxed">
              Select symptoms and run AI analysis. Urgent cases are flagged for
              your Health Extension Worker automatically.
            </Card>
          )}
        </div>
      </div>
    </MotherLayout>
  );
}
