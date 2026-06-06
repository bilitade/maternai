'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSession } from 'next-auth/react';
import type {
  MotherProfile,
  ANCContact,
  WellnessEntry,
  AIInsight,
  DangerSignReport,
  NutritionProfile,
} from '@/lib/types';
import { clearMaternaStorage } from '@/lib/storage';

export interface MotherDataState {
  loading: boolean;
  ready: boolean;
  profile: MotherProfile | null;
  ancContacts: ANCContact[];
  wellnessHistory: WellnessEntry[];
  deliveryPrep: number[];
  aiInsights: AIInsight[];
  dangerReports: DangerSignReport[];
  nutritionProfile: NutritionProfile;
  refresh: () => Promise<void>;
  patchLocal: (data: {
    ancContacts?: ANCContact[];
    wellnessHistory?: WellnessEntry[];
    deliveryPrep?: number[];
    aiInsights?: AIInsight[];
    dangerReports?: DangerSignReport[];
    nutritionProfile?: NutritionProfile;
  }) => void;
  setFromPayload: (data: Partial<MotherDataState>) => void;
}

const empty: Omit<MotherDataState, 'refresh' | 'setFromPayload' | 'patchLocal'> = {
  loading: false,
  ready: false,
  profile: null,
  ancContacts: [],
  wellnessHistory: [],
  deliveryPrep: [],
  aiInsights: [],
  dangerReports: [],
  nutritionProfile: {},
};

const MotherDataContext = createContext<MotherDataState | null>(null);

export function MotherDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [state, setState] = useState(empty);

  const applyPayload = useCallback(
    (data: {
      profile?: MotherProfile | null;
      ancContacts?: ANCContact[];
      wellnessHistory?: WellnessEntry[];
      deliveryPrep?: number[];
      aiInsights?: AIInsight[];
      dangerReports?: DangerSignReport[];
      nutritionProfile?: NutritionProfile;
    }) => {
      setState((prev) => ({
        ...prev,
        profile: data.profile !== undefined ? data.profile : prev.profile,
        ancContacts: data.ancContacts ?? prev.ancContacts,
        wellnessHistory: data.wellnessHistory ?? prev.wellnessHistory,
        deliveryPrep: data.deliveryPrep ?? prev.deliveryPrep,
        aiInsights: data.aiInsights ?? prev.aiInsights,
        dangerReports: data.dangerReports ?? prev.dangerReports,
        nutritionProfile: data.nutritionProfile ?? prev.nutritionProfile,
        ready: true,
        loading: false,
      }));
    },
    []
  );

  const refresh = useCallback(async () => {
    if (session?.user?.role !== 'mother') return;
    try {
      const res = await fetch('/api/mother', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      applyPayload(data);
    } catch {
      /* silent */
    }
  }, [session?.user?.role, applyPayload]);

  const loadInitial = useCallback(async () => {
    if (session?.user?.role !== 'mother') return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/mother', { cache: 'no-store' });
      if (!res.ok) {
        setState((prev) => ({ ...prev, loading: false, ready: true }));
        return;
      }
      const data = await res.json();
      applyPayload(data);
    } catch {
      setState((prev) => ({ ...prev, loading: false, ready: true }));
    }
  }, [session?.user?.role, applyPayload]);

  const patchLocal = useCallback(
    (data: {
      ancContacts?: ANCContact[];
      wellnessHistory?: WellnessEntry[];
      deliveryPrep?: number[];
      aiInsights?: AIInsight[];
      dangerReports?: DangerSignReport[];
      nutritionProfile?: NutritionProfile;
    }) => {
      setState((prev) => ({
        ...prev,
        ancContacts: data.ancContacts ?? prev.ancContacts,
        wellnessHistory: data.wellnessHistory ?? prev.wellnessHistory,
        deliveryPrep: data.deliveryPrep ?? prev.deliveryPrep,
        aiInsights: data.aiInsights ?? prev.aiInsights,
        dangerReports: data.dangerReports ?? prev.dangerReports,
        nutritionProfile: data.nutritionProfile ?? prev.nutritionProfile,
      }));
    },
    []
  );

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      queueMicrotask(() => setState(empty));
      return;
    }
    if (session?.user?.role === 'mother') {
      queueMicrotask(() => {
        void loadInitial();
      });
    } else {
      queueMicrotask(() => setState({ ...empty, ready: true }));
    }
  }, [status, session?.user?.role, session?.user?.id, loadInitial]);

  const value = useMemo(
    () => ({
      ...state,
      refresh,
      patchLocal,
      setFromPayload: applyPayload,
    }),
    [state, refresh, patchLocal, applyPayload]
  );

  return (
    <MotherDataContext.Provider value={value}>
      {children}
    </MotherDataContext.Provider>
  );
}

export function useMotherData(): MotherDataState {
  const ctx = useContext(MotherDataContext);
  if (!ctx) {
    throw new Error('useMotherData must be used within MotherDataProvider');
  }
  return ctx;
}

export function useMotherDataOptional(): MotherDataState | null {
  return useContext(MotherDataContext);
}

export { clearMaternaStorage };
