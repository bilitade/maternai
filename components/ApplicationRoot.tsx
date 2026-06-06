'use client';

import { useState } from 'react';
import type { AppView, DemoMother } from '@/lib/types';
import { LocaleProvider } from '@/components/providers/LocaleProvider';

import SplashPage from './views/SplashPage';
import RoleSelectPage from './views/RoleSelectPage';
import MotherOnboardingPage from './views/MotherOnboardingPage';
import MotherDashboard from './views/MotherDashboard';
import ANCTrackerPage from './views/ANCTrackerPage';
import DangerSignsPage from './views/DangerSignsPage';
import NutritionPage from './views/NutritionPage';
import WellnessCheckPage from './views/WellnessCheckPage';
import DeliveryPrepPage from './views/DeliveryPrepPage';
import HEWDashboard from './views/HEWDashboard';
import HEWMotherDetailPage from './views/HEWMotherDetailPage';

function ApplicationViews() {
  const [view, setView] = useState<AppView>('splash');
  const [selectedMother, setSelectedMother] = useState<DemoMother | null>(null);

  const navigate = (target: AppView) => setView(target);

  const selectMother = (mother: DemoMother) => {
    setSelectedMother(mother);
    setView('hewMotherDetail');
  };

  switch (view) {
    case 'splash':
      return <SplashPage onDone={() => navigate('roleSelect')} />;
    case 'roleSelect':
      return (
        <RoleSelectPage
          onSelect={(role) =>
            navigate(role === 'mother' ? 'motherOnboarding' : 'hewDashboard')
          }
        />
      );
    case 'motherOnboarding':
      return (
        <MotherOnboardingPage onComplete={() => navigate('motherDashboard')} />
      );
    case 'motherDashboard':
      return <MotherDashboard navigate={navigate} currentView={view} />;
    case 'ancTracker':
      return <ANCTrackerPage navigate={navigate} currentView={view} />;
    case 'dangerSigns':
      return <DangerSignsPage navigate={navigate} currentView={view} />;
    case 'nutrition':
      return <NutritionPage navigate={navigate} currentView={view} />;
    case 'wellnessCheck':
      return <WellnessCheckPage navigate={navigate} currentView={view} />;
    case 'deliveryPrep':
      return <DeliveryPrepPage navigate={navigate} currentView={view} />;
    case 'hewDashboard':
      return <HEWDashboard navigate={navigate} onSelectMother={selectMother} />;
    case 'hewMotherDetail':
      return (
        <HEWMotherDetailPage mother={selectedMother} navigate={navigate} />
      );
    default:
      return <SplashPage onDone={() => navigate('roleSelect')} />;
  }
}

export default function ApplicationRoot() {
  return (
    <LocaleProvider>
      <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col">
        <ApplicationViews />
      </div>
    </LocaleProvider>
  );
}
