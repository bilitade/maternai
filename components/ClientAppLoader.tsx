'use client';

import dynamic from 'next/dynamic';
import { ds } from '@/lib/design-system';

const ApplicationRoot = dynamic(
  () => import('@/components/ApplicationRoot'),
  {
    ssr: false,
    loading: () => (
      <div className={ds.splash}>
        <div className="w-12 h-12 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600 mt-4">MaternaAI</p>
      </div>
    ),
  }
);

export default function ClientAppLoader() {
  return <ApplicationRoot />;
}
