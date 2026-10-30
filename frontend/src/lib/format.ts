import type { Period, Transaction } from '../types';

const nf = new Intl.NumberFormat('vi-VN');

export const money = (n: number) => `${nf.format(Math.round(n || 0))} đ`;
export const moneyNum = (n: number) => nf.format(Math.round(n || 0));

export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `${(n / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
  if (a >= 1e6) return `${(n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
  if (a >= 1e3) return `${(n / 1e3).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}k`;
  return String(Math.round(n));
}

/** Giữ chỉ chữ số và định dạng theo kiểu Việt Nam khi người dùng gõ. */
export const formatMoneyInput = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? nf.format(Number(digits)) : '';
};
export const parseMoneyInput = (value: string) => Number(value.replace(/\./g, '')) || 0;

export const pad = (n: number) => String(n).padStart(2, '0');
export const toYmd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const dayKey = (s: string) => String(s || '').slice(0, 10);
export const formatDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');
export const periodLabel = (p: Period) => `Tháng ${p.month}, ${p.year}`;

export function periodRange(p: Period) {
  const last = new Date(p.year, p.month, 0).getDate();
  return { start: `${p.year}-${pad(p.month)}-01`, end: `${p.year}-${pad(p.month)}-${pad(last)}` };
}

export const prevPeriod = (p: Period): Period =>
  p.month === 1 ? { month: 12, year: p.year - 1 } : { month: p.month - 1, year: p.year };

export const isTransfer = (t: Pick<Transaction, 'note' | 'category_name'>) =>
  !!(t.note && (t.note.includes('[Chuyển tiền]') || t.note.includes('[Nhận tiền]'))) || t.category_name === 'Chuyển khoản';

export function dayLabel(key: string): string {
  const today = toYmd(new Date());
  const yest = toYmd(new Date(Date.now() - 864e5));
  if (key === today) return 'Hôm nay';
  if (key === yest) return 'Hôm qua';
  return new Date(`${key}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}
