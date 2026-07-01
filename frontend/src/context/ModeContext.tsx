import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mode = 'production' | 'demo';

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('app_mode');
    return (saved === 'demo' || saved === 'production') ? saved : 'demo';
  });

  useEffect(() => {
    localStorage.setItem('app_mode', mode);
  }, [mode]);

  const toggleMode = () => setMode(prev => prev === 'demo' ? 'production' : 'demo');

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within a ModeProvider');
  return context;
};
