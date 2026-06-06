'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { AppView } from '@/lib/types';
import { getWellnessHistory, saveWellnessEntry } from '@/lib/storage';
import { getWellnessMessage } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import MotherLayout from '@/components/layout/MotherLayout';

interface Props {
  navigate: (view: AppView) => void;
  currentView: AppView;
}

const QUESTIONS = [
  'How are you feeling overall today?',
  'Have you felt hopeless or very sad this week?',
  'Are you sleeping well?',
  'Do you feel supported by your family?',
  'Have you had enough to eat this week?',
];

const EMOJIS = ['😞', '😕', '😐', '🙂', '😊'];

export default function WellnessCheckPage({
  navigate,
  currentView,
}: Props) {
  const { t } = useLocale();
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(5).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = async () => {
    const total = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
    const computedScore = Math.round((total / 25) * 100);
    setScore(computedScore);
    setSubmitted(true);

    const entry = {
      date: new Date().toISOString().slice(0, 10),
      score: computedScore,
      answers: answers as number[],
    };
    saveWellnessEntry(entry);

    const history = [...getWellnessHistory(), entry];
    let consecutiveLow = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].score < 40) consecutiveLow++;
      else break;
    }

    if (computedScore < 40 && consecutiveLow >= 2) {
      setLoading(true);
      try {
        const text = await getWellnessMessage(computedScore, consecutiveLow);
        setMessage(text);
      } catch {
        setMessage(t('aiError'));
      } finally {
        setLoading(false);
      }
    }
  };

  const scoreColor =
    score >= 70
      ? 'text-emerald-600'
      : score >= 40
        ? 'text-amber-600'
        : 'text-red-600';

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Weekly Check-in"
      subtitle="Track your mental and physical wellness"
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      {!submitted ? (
        <div className="max-w-3xl flex flex-col gap-6">
          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <p className="text-sm lg:text-base font-medium text-gray-800 mb-3">
                {q}
              </p>
              <div className="flex justify-between gap-2 max-w-md">
                {EMOJIS.map((emoji, val) => (
                  <button
                    key={val}
                    onClick={() => {
                      const next = [...answers];
                      next[i] = val + 1;
                      setAnswers(next);
                    }}
                    className={`flex-1 py-3 text-xl sm:text-2xl rounded-xl border transition-colors
                      ${
                        answers[i] === val + 1
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-white'
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all w-full sm:w-auto sm:min-w-[200px] disabled:opacity-50"
          >
            Submit Check-in
          </button>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Your wellness score</p>
            <p className={`text-5xl lg:text-6xl font-bold ${scoreColor}`}>
              {score}
            </p>
            <p className="text-sm text-gray-500 mt-1">out of 100</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Getting support message...</span>
            </div>
          )}

          {message && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}

          {score < 40 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <p className="text-sm font-medium text-red-800">
                {t('crisisHelpline')}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('motherDashboard')}
            className="border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </MotherLayout>
  );
}
