import React, { createContext, useContext, useEffect, useState } from 'react';
import { getWeekInfo, setUserWeek, isAuthenticated, authEvents } from '../services/api';
import type { WeekInfoResponse } from '../services/api';

interface WeekContextValue {
  weekInfo: WeekInfoResponse | null;
  refreshWeek: () => Promise<void>;
  setCurrentWeek: (currentWeek: number) => Promise<WeekInfoResponse>;
}

const WeekContext = createContext<WeekContextValue | undefined>(undefined);

export const WeekProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weekInfo, setWeekInfo] = useState<WeekInfoResponse | null>(null);

  const refreshWeek = async () => {
    try {
      if (!isAuthenticated()) return;
      const wi = await getWeekInfo();
      setWeekInfo(wi);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // only fetch if currently authenticated
    refreshWeek();

    // listen for explicit login events so we can refresh when user logs in
    const onLogin = () => { refreshWeek(); };
    authEvents.addEventListener('login', onLogin as EventListener);
    return () => {
      authEvents.removeEventListener('login', onLogin as EventListener);
    };
  }, []);

  const setCurrentWeek = async (currentWeek: number) => {
    const resp = await setUserWeek({ currentWeek });
    setWeekInfo(resp);
    return resp;
  };

  return (
    <WeekContext.Provider value={{ weekInfo, refreshWeek, setCurrentWeek }}>
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => {
  const ctx = useContext(WeekContext);
  if (!ctx) throw new Error('useWeek must be used within WeekProvider');
  return ctx;
};

export default WeekContext;
