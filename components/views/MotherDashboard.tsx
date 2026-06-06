'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import type { AIInsightType } from '@/lib/types';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { MOTHER_FEATURE_CARDS, INSIGHT_PATHS } from '@/lib/motherNav';
import { VIEW_PATH } from '@/lib/routes';
import RiskBadge from '@/components/ui/RiskBadge';
import AISourceBadge from '@/components/ui/AISourceBadge';
import { useLocale } from '@/components/providers/LocaleProvider';
import type { MessageKey } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import Card from '@/components/ui/Card';

const INSIGHT_KEYS: Record<AIInsightType, MessageKey> = {
  danger: 'insightDanger',
  nutrition: 'insightNutrition',
  wellness: 'insightWellness',
};

export default function MotherDashboard() {
  const { t, tf } = useLocale();
  const { profile, wellnessHistory, aiInsights, dangerReports } = useMotherData();
  const history = wellnessHistory.slice(-6);
  const latestInsight = aiInsights.length ? aiInsights[aiInsights.length - 1] : null;
  const dangerReport = dangerReports.length
    ? dangerReports[dangerReports.length - 1]
    : null;

  const subtitle = profile?.gestationalAgeWeeks
    ? `${tf('weekOf', { weeks: profile.gestationalAgeWeeks })}${
        profile.edd
          ? ` · ${t('eddLabel')} ${new Date(profile.edd).toLocaleDateString()}`
          : ''
      } · ${t('welcomeBack')}`
    : t('welcomeBack');

  useMotherPageHeader({
    title: profile?.name ?? t('roleMother'),
    subtitle,
  });

  return (
    <div className="flex flex-col gap-6">
      {profile && (
        <RiskBadge level={profile.riskLevel} factors={profile.riskFactors} />
      )}

      {latestInsight && (
        <Link
          href={INSIGHT_PATHS[latestInsight.type] ?? VIEW_PATH.motherDashboard}
          className={cn(
            ds.card,
            ds.cardPadding,
            'block text-left hover:shadow-md hover:border-teal-200/60 transition-all'
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Sparkles size={16} className="text-teal-600" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {t('latestAiInsight')}
              </p>
            </div>
            <AISourceBadge source={latestInsight.source} />
          </div>
          <p className="text-xs text-slate-500 mb-2">
            {t(INSIGHT_KEYS[latestInsight.type])} ·{' '}
            {new Date(latestInsight.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
            {latestInsight.text}
          </p>
        </Link>
      )}

      {dangerReport && dangerReport.signs.length > 0 && dangerReport.urgent && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-rose-800">{t('urgentFlagged')}</p>
          <Link
            href={VIEW_PATH.dangerSigns}
            className="text-xs text-rose-700 underline mt-1 inline-block"
          >
            {t('viewAssessment')}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOTHER_FEATURE_CARDS.map(({ labelKey, icon: Icon, href, iconStyle }) => (
          <Link
            key={href}
            href={href}
            prefetch
            className={cn(
              ds.card,
              ds.cardPadding,
              'block text-left hover:shadow-md hover:border-teal-200/60 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]'
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
          </Link>
        ))}
      </div>

      {history.length > 0 && (
        <Card>
          <p className="text-sm lg:text-base font-medium text-slate-700 mb-4">
            {t('wellnessTrend')}
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
                formatter={(v) => [`${v}/100`, t('wellnessScore')]}
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
  );
}
