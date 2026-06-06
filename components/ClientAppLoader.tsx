'use client';

import dynamic from 'next/dynamic';

const ApplicationRoot = dynamic(
  () => import('@/components/ApplicationRoot'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-emerald-700 text-white">
        <p className="text-lg font-semibold tracking-tight">MaternaAI</p>
      </div>
    ),
  }
);

export default function ClientAppLoader() {
  return <ApplicationRoot />;
}
