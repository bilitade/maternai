'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface MotherPageHeader {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

interface MotherPageContextValue {
  header: MotherPageHeader;
  setHeader: (header: MotherPageHeader) => void;
}

const MotherPageContext = createContext<MotherPageContextValue | null>(null);

const defaultHeader: MotherPageHeader = { title: '' };

export function MotherPageProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<MotherPageHeader>(defaultHeader);
  const setHeader = useCallback((next: MotherPageHeader) => {
    setHeaderState(next);
  }, []);

  const value = useMemo(
    () => ({ header, setHeader }),
    [header, setHeader]
  );

  return (
    <MotherPageContext.Provider value={value}>
      {children}
    </MotherPageContext.Provider>
  );
}

export function useMotherPageContext() {
  const ctx = useContext(MotherPageContext);
  if (!ctx) {
    throw new Error('useMotherPageContext must be used within MotherPageProvider');
  }
  return ctx;
}

/** Set shell header from a dashboard page — layout stays mounted, only header + main swap. */
export function useMotherPageHeader(header: MotherPageHeader) {
  const { setHeader } = useMotherPageContext();
  const { title, subtitle, backHref, backLabel } = header;

  useEffect(() => {
    setHeader({ title, subtitle, backHref, backLabel });
  }, [title, subtitle, backHref, backLabel, setHeader]);
}
