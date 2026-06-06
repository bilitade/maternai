'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { AppView } from '@/lib/types';
import { getProfile, getWellnessHistory } from '@/lib/storage';
import { MOTHER_FEATURE_CARDS } from '@/lib/motherNav';
import RiskBadge from '@/components/ui/RiskBadge';
import MotherLayout from '@/components/layout/MotherLayout';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

export default function MotherDashboard({ navigate, currentView }: Props) {
  const { t, tf } = useLocale();
  const profile = getProfile();
  const history = getWellnessHistory().slice(-6);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOTHER_FEATURE_CARDS.map(({ labelKey, icon: Icon, view, color }) => (
            <button
              key={view}
              onClick={() => navigate(view)}
              className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 text-left shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}
              >
                <Icon size={22} />
              </div>
              <p className="text-sm lg:text-base font-medium text-gray-800">
                {t(labelKey)}
              </p>
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm">
            <p className="text-sm lg:text-base font-medium text-gray-700 mb-4">
              Wellness trend
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={history} barSize={32}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#374151' }}
                  tickFormatter={(d: string) => d.slice(5)}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#374151' }}
                  width={32}
                />
                <Tooltip formatter={(v) => [`${v}/100`, 'Score']} />
                <Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </MotherLayout>
  );
}
