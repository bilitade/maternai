'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { AppView, DemoMother } from '@/lib/types';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { ds } from '@/lib/design-system';
import { hydrateFromServer } from '@/lib/sync';

import SplashPage from './views/SplashPage';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';
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

function routeForUser(
  role: string,
  hasProfile: boolean
): AppView {
  if (role === 'hew') return 'hewDashboard';
  return hasProfile ? 'motherDashboard' : 'motherOnboarding';
}

function ApplicationViews() {
  const { data: session, status, update } = useSession();
  const [view, setView] = useState<AppView>('splash');
  const [selectedMother, setSelectedMother] = useState<DemoMother | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const navigate = (target: AppView) => setView(target);

  const selectMother = (mother: DemoMother) => {
    setSelectedMother(mother);
    setView('hewMotherDetail');
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' && view !== 'splash' && view !== 'login' && view !== 'signup') {
      setView('login');
    }
  }, [status, view]);

  const afterAuth = async () => {
    await hydrateFromServer();
    const s = await update();
    setHydrated(true);
    if (s?.user) {
      setView(routeForUser(s.user.role, s.user.hasProfile));
    }
  };

  useEffect(() => {
    if (session?.user && !hydrated && status === 'authenticated') {
      hydrateFromServer().then(() => {
        setHydrated(true);
        setView(routeForUser(session.user.role, session.user.hasProfile));
      });
    }
  }, [session, status, hydrated]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setHydrated(false);
    setView('login');
  };

  if (status === 'loading' && view === 'splash') {
    return (
      <div className={ds.splash}>
        <div className="w-12 h-12 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  switch (view) {
    case 'splash':
      return (
        <SplashPage
          onDone={() =>
            navigate(session ? routeForUser(session.user.role, session.user.hasProfile) : 'login')
          }
        />
      );
    case 'login':
      return (
        <LoginPage
          onSuccess={afterAuth}
          onGoSignup={() => navigate('signup')}
        />
      );
    case 'signup':
      return (
        <SignupPage
          onSuccess={afterAuth}
          onGoLogin={() => navigate('login')}
        />
      );
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
        <MotherOnboardingPage
          onComplete={async () => {
            await update();
            navigate('motherDashboard');
          }}
        />
      );
    case 'motherDashboard':
      return (
        <MotherDashboard
          navigate={navigate}
          currentView={view}
          onLogout={handleLogout}
        />
      );
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
      return (
        <HEWDashboard
          navigate={navigate}
          onSelectMother={selectMother}
          onLogout={handleLogout}
        />
      );
    case 'hewMotherDetail':
      return (
        <HEWMotherDetailPage mother={selectedMother} navigate={navigate} />
      );
    default:
      return <SplashPage onDone={() => navigate('login')} />;
  }
}

export default function ApplicationRoot() {
  return (
    <LocaleProvider>
      <div className={ds.page}>
        <ApplicationViews />
      </div>
    </LocaleProvider>
  );
}
