'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import type { AppView, AIInsightType } from '@/lib/types';
import {
  getProfile,
  getWellnessHistory,
  getLatestAIInsight,
  getLatestDangerReport,
} from '@/lib/storage';
import { MOTHER_FEATURE_CARDS } from '@/lib/motherNav';
import RiskBadge from '@/components/ui/RiskBadge';
import AISourceBadge from '@/components/ui/AISourceBadge';
import MotherLayout from '@/components/layout/MotherLayout';
import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import Card from '@/components/ui/Card';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

const INSIGHT_LABELS: Record<AIInsightType, string> = {
  danger: 'Danger sign assessment',
  nutrition: 'Nutrition tip',
  wellness: 'Wellness support',
};

const INSIGHT_VIEWS: Record<AIInsightType, AppView> = {
  danger: 'dangerSigns',
  nutrition: 'nutrition',
  wellness: 'wellnessCheck',
};

export default function MotherDashboard({ navigate, currentView }: Props) {
  const { t, tf } = useLocale();
  const profile = getProfile();
  const history = getWellnessHistory().slice(-6);
  const latestInsight = getLatestAIInsight();
  const dangerReport = getLatestDangerReport();

  const subtitle = profile?.gestationalAgeWeeks
    ? `${tf('weekOf', { weeks: profile.gestationalAgeWeeks })} · ${t('welcomeBack')}`
    : t('welcomeBack');

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title={profile?.name ?? t('roleMother')}
      subtitle={subtitle}
    >
      <div className="flex flex-col gap-6">
        {profile && (
          <RiskBadge level={profile.riskLevel} factors={profile.riskFactors} />
        )}

        {latestInsight && (
          <button
            type="button"
            onClick={() => navigate(INSIGHT_VIEWS[latestInsight.type])}
            className={cn(
              ds.card,
              ds.cardPadding,
              'text-left hover:shadow-md hover:border-teal-200/60 transition-all'
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Sparkles size={16} className="text-teal-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Latest AI insight
                </p>
              </div>
              <AISourceBadge source={latestInsight.source} />
            </div>
            <p className="text-xs text-slate-500 mb-2">
              {INSIGHT_LABELS[latestInsight.type]} ·{' '}
              {new Date(latestInsight.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
              {latestInsight.text}
            </p>
          </button>
        )}

        {dangerReport &&
          dangerReport.signs.length > 0 &&
          dangerReport.urgent && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
              <p className="text-sm font-medium text-rose-800">
                Urgent symptom report on file — your HEW has been flagged.
              </p>
              <button
                type="button"
                onClick={() => navigate('dangerSigns')}
                className="text-xs text-rose-700 underline mt-1"
              >
                View assessment
              </button>
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOTHER_FEATURE_CARDS.map(({ labelKey, icon: Icon, view, iconStyle }) => (
            <button
              key={view}
              type="button"
              onClick={() => navigate(view)}
              className={cn(
                ds.card,
                ds.cardPadding,
                'text-left hover:shadow-md hover:border-teal-200/60 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center mb-3',
                  iconStyle
                )}
              >
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <p className="text-sm lg:text-base font-medium text-slate-800">
                {t(labelKey)}
              </p>
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <Card>
            <p className="text-sm lg:text-base font-medium text-slate-700 mb-4">
              Wellness trend
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={history} barSize={32}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(d: string) => d.slice(5)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={32}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}/100`, 'Score']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  }}
                />
                <Bar
                  dataKey="score"
                  fill={ds.chartPrimary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </MotherLayout>
  );
}
