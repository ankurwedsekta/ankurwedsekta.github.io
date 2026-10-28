import {createContext, useCallback, useContext, useState, type ReactNode} from 'react';

const STORAGE_KEY = 'painted-palace:opened';

type GateApi = {opened: boolean; open: () => void};
const GateContext = createContext<GateApi>({opened: true, open: () => {}});

const wasOpened = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export function GateProvider({children}: {children: ReactNode}) {
  const [opened, setOpened] = useState(wasOpened);
  const open = useCallback(() => {
    setOpened(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Storage can be unavailable in private modes; the doors simply reappear next visit.
    }
  }, []);
  return <GateContext.Provider value={{opened, open}}>{children}</GateContext.Provider>;
}

export const useGate = () => useContext(GateContext);
