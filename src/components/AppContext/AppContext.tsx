'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AppContextType {
  entered: boolean;
  setEntered: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  return (
    <AppContext.Provider value={{ entered, setEntered }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
