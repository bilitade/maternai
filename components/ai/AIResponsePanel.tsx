'use client';

import { Suspense, use } from 'react';
import { Loader2 } from 'lucide-react';
import AISourceBadge from '@/components/ui/AISourceBadge';
import { cn } from '@/lib/cn';
import { ds } from '@/lib/design-system';
import type { AIResult } from '@/lib/ai';

interface AIResponsePanelProps {
  /** When set, Suspense boundary resolves this promise */
  promise: Promise<AIResult> | null;
  loading: boolean;
  loadingMessage: string;
  title: string;
  errorMessage?: string;
  variant?: 'success' | 'info' | 'danger' | 'warning';
  footer?: string;
  className?: string;
}

function variantClass(variant: AIResponsePanelProps['variant']) {
  switch (variant) {
    case 'danger':
      return 'bg-rose-50 border-rose-400 border-2';
    case 'warning':
      return 'bg-amber-50 border-amber-300 border-2';
    case 'info':
      return ds.alertInfo;
    default:
      return ds.alertSuccess;
  }
}

function AIResultBody({
  promise,
  title,
  footer,
  variant = 'success',
}: {
  promise: Promise<AIResult>;
  title: string;
  footer?: string;
  variant?: AIResponsePanelProps['variant'];
}) {
  const { text, source } = use(promise);
  return (
    <div className={cn('rounded-2xl p-5', variantClass(variant))}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {title}
        </p>
        <AISourceBadge source={source} />
      </div>
      <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
        {text}
      </p>
      {footer && (
        <p className="text-xs text-slate-500 mt-3 border-t border-slate-200/80 pt-2">
          {footer}
        </p>
      )}
    </div>
  );
}

function AIResponseFallback({ message }: { message: string }) {
  return (
    <div
      className={cn(ds.alertSuccess, 'rounded-2xl p-5 min-h-[120px] flex items-center')}
      aria-busy="true"
    >
      <div className="flex items-center gap-2 text-teal-700">
        <Loader2 size={18} className="animate-spin shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export default function AIResponsePanel({
  promise,
  loading,
  loadingMessage,
  title,
  errorMessage,
  variant = 'success',
  footer,
  className,
}: AIResponsePanelProps) {
  if (errorMessage) {
    return (
      <div className={cn('rounded-2xl p-5', ds.alertDanger, className)}>
        <p className={ds.alertDangerText}>{errorMessage}</p>
      </div>
    );
  }

  if (loading && !promise) {
    return <AIResponseFallback message={loadingMessage} />;
  }

  if (!promise && !loading) {
    return null;
  }

  return (
    <div className={cn('min-h-[120px]', className)} aria-live="polite">
      <Suspense fallback={<AIResponseFallback message={loadingMessage} />}>
        {promise && (
          <AIResultBody
            promise={promise}
            title={title}
            footer={footer}
            variant={variant}
          />
        )}
      </Suspense>
    </div>
  );
}
