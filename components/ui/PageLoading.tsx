import { ds } from '@/lib/design-system';

interface Props {
  message?: string;
}

export default function PageLoading({ message = 'Loading...' }: Props) {
  return (
    <div className={ds.splash}>
      <div className="w-10 h-10 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      <p className="text-sm font-medium text-slate-600 mt-3">{message}</p>
    </div>
  );
}
