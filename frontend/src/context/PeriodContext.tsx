import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Period } from '../types';

interface PeriodValue {
  period: Period;
  setPeriod: (month: number, year: number) => void;
  shift: (delta: number) => void;
  isCurrent: boolean;
}

const KEY = 'pb_period';
const PeriodContext = createContext<PeriodValue | null>(null);

function initial(): Period {
  const now = new Date();
  const fallback = { month: now.getMonth() + 1, year: now.getFullYear() };
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    if (saved && saved.month >= 1 && saved.month <= 12 && saved.year > 2000) return saved;
  } catch { /* dùng giá trị mặc định */ }
  return fallback;
}

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setState] = useState<Period>(initial);

  const setPeriod = useCallback((month: number, year: number) => {
    while (month < 1) { month += 12; year -= 1; }
    while (month > 12) { month -= 12; year += 1; }
    const next = { month, year };
    setState(next);
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* bỏ qua */ }
  }, []);

  const shift = useCallback((delta: number) => setPeriod(period.month + delta, period.year), [period, setPeriod]);

  const value = useMemo(() => {
    const now = new Date();
    return { period, setPeriod, shift, isCurrent: period.month === now.getMonth() + 1 && period.year === now.getFullYear() };
  }, [period, setPeriod, shift]);

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod(): PeriodValue {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod phải nằm trong PeriodProvider');
  return ctx;
}
