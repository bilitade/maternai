import { cn } from '@/lib/cn';

interface Props {
  source: 'ai' | 'offline';
  className?: string;
}

export default function AISourceBadge({ source, className }: Props) {
  const isAI = source === 'ai';
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full',
        isAI
          ? 'bg-teal-100 text-teal-700'
          : 'bg-slate-100 text-slate-600',
        className
      )}
    >
      {isAI ? 'Live AI' : 'Offline guidance'}
    </span>
  );
}
