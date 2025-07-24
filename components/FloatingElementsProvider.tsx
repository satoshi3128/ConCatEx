'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FloatingElementsContextType {
  isFloatingEnabled: boolean;
  setFloatingEnabled: (enabled: boolean) => void;
}

const FloatingElementsContext = createContext<FloatingElementsContextType | undefined>(undefined);

export function useFloatingElements() {
  const context = useContext(FloatingElementsContext);
  if (context === undefined) {
    throw new Error('useFloatingElements must be used within a FloatingElementsProvider');
  }
  return context;
}

interface FloatingElementsProviderProps {
  children: ReactNode;
}

export function FloatingElementsProvider({ children }: FloatingElementsProviderProps) {
  const [isFloatingEnabled, setIsFloatingEnabled] = useState(true);

  // ローカルストレージから初期状態を読み込み
  useEffect(() => {
    const savedState = localStorage.getItem('floating-elements-enabled');
    if (savedState !== null) {
      setIsFloatingEnabled(savedState === 'true');
    }
  }, []);

  const setFloatingEnabled = (enabled: boolean) => {
    setIsFloatingEnabled(enabled);
    localStorage.setItem('floating-elements-enabled', enabled.toString());
  };

  return (
    <FloatingElementsContext.Provider value={{ isFloatingEnabled, setFloatingEnabled }}>
      {children}
    </FloatingElementsContext.Provider>
  );
}