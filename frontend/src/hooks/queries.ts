import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { periodRange } from '../lib/format';
import { useUser } from '../context/AuthContext';
import type { Period } from '../types';

export function useWallets() {
  const u = useUser();
  return useQuery({ queryKey: ['wallets', u.id], queryFn: () => api.wallets(u.id) });
}

export function useCategories() {
  const u = useUser();
  return useQuery({ queryKey: ['categories', u.id], queryFn: () => api.categories(u.id) });
}

export function useReport(period: Period) {
  const u = useUser();
  return useQuery({ queryKey: ['report', u.id, period.month, period.year], queryFn: () => api.report(u.id, period.month, period.year) });
}

export function useBudgets(period: Period) {
  const u = useUser();
  return useQuery({ queryKey: ['budgets', u.id, period.month, period.year], queryFn: () => api.budgets(u.id, period.month, period.year) });
}

/** Giao dịch trong khoảng ngày [start, end] (YYYY-MM-DD). */
export function useTransactionsBetween(start: string, end: string) {
  const u = useUser();
  return useQuery({
    queryKey: ['transactions', u.id, 'range', start, end],
    queryFn: () => api.transactions({ user_id: u.id, start_date: start, end_date: end }),
  });
}

export function usePeriodTransactions(period: Period) {
  const { start, end } = periodRange(period);
  return useTransactionsBetween(start, end);
}

export function useAdvice(period: Period) {
  const u = useUser();
  return useQuery({
    queryKey: ['advice', u.id, period.month, period.year],
    queryFn: () => api.advice(u.id, period.month, period.year),
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** Làm mới mọi dữ liệu phụ thuộc giao dịch sau khi thêm, xóa hoặc chuyển tiền. */
export function useRefreshMoney() {
  const qc = useQueryClient();
  return () => Promise.all(
    ['transactions', 'wallets', 'report', 'budgets', 'categories', 'advice'].map(k => qc.invalidateQueries({ queryKey: [k] })),
  );
}
