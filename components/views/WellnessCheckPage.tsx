'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMotherData } from '@/components/providers/MotherDataProvider';
import { useMotherPageHeader } from '@/components/providers/MotherPageProvider';
import { saveAIInsights, saveWellnessHistory } from '@/lib/motherApi';
import { getWellnessMessage } from '@/lib/ai';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getWellnessQuestions } from '@/lib/locale/content';
import { VIEW_PATH } from '@/lib/routes';
import Card, { Button } from '@/components/ui/Card';
import AIResponsePanel from '@/components/ai/AIResponsePanel';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import type { AIResult } from '@/lib/ai';

const EMOJIS = ['😞', '😕', '😐', '🙂', '😊'];

export default function WellnessCheckPage() {
  const { t, locale } = useLocale();
  const { wellnessHistory, aiInsights, patchLocal } = useMotherData();
  const questions = getWellnessQuestions(locale);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiPromise, setAiPromise] = useState<Promise<AIResult> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useMotherPageHeader({
    title: t('wellnessTitle'),
    subtitle: t('wellnessSubtitle'),
    backHref: VIEW_PATH.motherDashboard,
    backLabel: t('dashboard'),
  });

  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = async () => {
    const total = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
    const computedScore = Math.round((total / 25) * 100);
    setScore(computedScore);
    setSubmitted(true);
    setErrorMessage(null);
    setAiPromise(null);

    const entry = {
      date: new Date().toISOString().slice(0, 10),
      score: computedScore,
      answers: answers as number[],
    };

    const history = [...wellnessHistory, entry];
    let consecutiveLow = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].score < 40) consecutiveLow++;
      else break;
    }

    setLoading(true);
    await saveWellnessHistory(history);
    patchLocal({ wellnessHistory: history });

    const promise = getWellnessMessage(computedScore, consecutiveLow, locale)
      .then(async (result) => {
        const nextInsights = [
          ...aiInsights.slice(-19),
          {
            type: 'wellness' as const,
            text: result.text,
            source: result.source,
            date: new Date().toISOString(),
            meta: { score: computedScore },
          },
        ];
        await saveAIInsights(nextInsights);
        patchLocal({ aiInsights: nextInsights });
        return result;
      })
      .catch(() => {
        setErrorMessage(t('aiError'));
        return { text: t('aiError'), source: 'offline' as const };
      })
      .finally(() => setLoading(false));

    setAiPromise(promise);
  };

  const scoreColor =
    score >= 70 ? 'text-teal-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600';

  if (!submitted) {
    return (
      <div className="max-w-3xl flex flex-col gap-6">
        {questions.map((q, i) => (
          <Card key={i}>
            <p className="text-sm lg:text-base font-medium text-slate-800 mb-3">
              {q}
            </p>
            <div className="flex justify-between gap-2 max-w-md">
              {EMOJIS.map((emoji, val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[i] = val + 1;
                    setAnswers(next);
                  }}
                  className={cn(
                    'flex-1 py-3 text-xl sm:text-2xl rounded-xl border transition-colors',
                    answers[i] === val + 1 ? ds.chipSelected : ds.chipDefault
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </Card>
        ))}
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full sm:w-auto sm:min-w-[200px]"
        >
          {t('wellnessSubmit')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Card className="text-center py-8">
        <p className="text-sm text-slate-600 mb-1">{t('wellnessScore')}</p>
        <p className={cn('text-5xl lg:text-6xl font-bold', scoreColor)}>{score}</p>
        <p className="text-sm text-slate-500 mt-1">{t('scoreOutOf')}</p>
      </Card>

      <AIResponsePanel
        promise={aiPromise}
        loading={loading}
        loadingMessage={t('wellnessAiLoading')}
        title={t('wellnessAiTitle')}
        errorMessage={errorMessage ?? undefined}
        variant="info"
      />

      {score < 40 && (
        <div className={ds.alertDanger}>
          <p className={cn(ds.alertDangerText, 'font-medium')}>
            {t('crisisHelpline')}
          </p>
        </div>
      )}

      <Link
        href={VIEW_PATH.motherDashboard}
        className={cn(
          ds.btnSecondary,
          'inline-flex w-full sm:w-auto justify-center items-center'
        )}
      >
        {t('wellnessBackDash')}
      </Link>
    </div>
  );
}
