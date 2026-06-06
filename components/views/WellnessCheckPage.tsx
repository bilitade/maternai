'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { AppView } from '@/lib/types';
import { getWellnessHistory, saveWellnessEntry } from '@/lib/storage';
import { saveAIInsightSync, saveWellnessEntrySync } from '@/lib/sync';
import { getWellnessMessage } from '@/lib/ai';
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
  const [messageSource, setMessageSource] = useState<'ai' | 'offline' | null>(
    null
  );
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
    saveWellnessEntrySync(entry);

    const history = [...getWellnessHistory(), entry];
    let consecutiveLow = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].score < 40) consecutiveLow++;
      else break;
    }

    setLoading(true);
    try {
      const { text, source } = await getWellnessMessage(
        computedScore,
        consecutiveLow
      );
      setMessage(text);
      setMessageSource(source);
      saveAIInsightSync({
        type: 'wellness',
        text,
        source,
        date: new Date().toISOString(),
        meta: { score: computedScore },
      });
    } catch {
      setMessage(t('aiError'));
      setMessageSource(null);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    score >= 70
      ? 'text-teal-600'
      : score >= 40
        ? 'text-amber-600'
        : 'text-rose-600';

  return (
    <MotherLayout
      currentView={currentView}
      navigate={navigate}
      title="Weekly Check-in"
      subtitle="AI responds to every check-in with personalized support"
      onBack={() => navigate('motherDashboard')}
      backLabel="Dashboard"
    >
      {!submitted ? (
        <div className="max-w-3xl flex flex-col gap-6">
          {QUESTIONS.map((q, i) => (
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
                      answers[i] === val + 1
                        ? ds.chipSelected
                        : ds.chipDefault
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
            Submit & get AI support
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-4">
          <Card className="text-center py-8">
            <p className="text-sm text-slate-600 mb-1">Your wellness score</p>
            <p className={cn('text-5xl lg:text-6xl font-bold', scoreColor)}>
              {score}
            </p>
            <p className="text-sm text-slate-500 mt-1">out of 100</p>
          </Card>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">AI is writing your support message...</span>
            </div>
          )}

          {message && !loading && (
            <div className={ds.alertInfo}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide">
                  AI wellness message
                </p>
                {messageSource && <AISourceBadge source={messageSource} />}
              </div>
              <p className={ds.alertInfoText}>{message}</p>
            </div>
          )}

          {score < 40 && (
            <div className={ds.alertDanger}>
              <p className={cn(ds.alertDangerText, 'font-medium')}>
                {t('crisisHelpline')}
              </p>
            </div>
          )}

          <Button
            variant="secondary"
            onClick={() => navigate('motherDashboard')}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </MotherLayout>
  );
}
