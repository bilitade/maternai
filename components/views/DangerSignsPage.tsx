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
import { getProfile } from '@/lib/storage';
import { analyzeDangerSigns } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import MotherLayout from '@/components/layout/MotherLayout';

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

export default function DangerSignsPage({ navigate, currentView }: Props) {
  const { t } = useLocale();
  const profile = getProfile();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSign = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
    setResult(null);
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setResult('clear');
      return;
    }
    setLoading(true);
    try {
      const labels = DANGER_SIGNS.filter((s) => selected.has(s.id)).map(
        (s) => s.label
      );
      const text = await analyzeDangerSigns(
        labels,
        profile?.gestationalAgeWeeks ?? 20
      );
      setResult(text);
    } catch {
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  const isUrgent =
    selected.has('bleeding') ||
    (selected.has('headache') && selected.has('vision'));

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Danger Signs"
      subtitle="Select any symptoms you are experiencing right now"
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
                  onClick={() => toggleSign(sign.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${
                      isSelected
                        ? 'bg-red-100 border-2 border-red-400 text-red-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {Icon && <Icon size={16} />}
                  {sign.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all w-full sm:w-auto sm:min-w-[200px] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </div>

        <div className="flex-1 max-w-xl">
          {result === 'clear' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-sm text-emerald-800">
                No danger signs selected. Continue monitoring and attend your
                ANC visits. Contact your HEW if anything changes.
              </p>
            </div>
          )}

          {result === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <p className="text-sm text-red-800">{t('aiError')}</p>
            </div>
          )}

          {result && result !== 'clear' && result !== 'error' && (
            <div
              className={`rounded-2xl p-5 border-2 ${
                isUrgent
                  ? 'bg-red-50 border-red-400'
                  : 'bg-amber-50 border-amber-300'
              }`}
            >
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {result}
              </p>
              <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                {t('dangerDisclaimer')}
              </p>
            </div>
          )}

          {!result && (
            <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl p-5 text-sm text-gray-500">
              Select symptoms and click Check Symptoms to receive AI-guided
              guidance. Urgent combinations will be highlighted in red.
            </div>
          )}
        </div>
      </div>
    </MotherLayout>
  );
}
