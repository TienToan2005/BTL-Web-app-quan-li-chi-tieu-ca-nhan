import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { glowColor, nameStyle } from '../lib/icons';
import { compact, dayKey, isTransfer, money, pad, toYmd } from '../lib/format';
import type { Period, ReportItem, Transaction } from '../types';
import { Empty } from './ui';

export const C = { income: '#34D399', expense: '#FB7185', blue: '#5B8CFF', violet: '#9B7BFF', grid: 'rgba(255,255,255,.07)', tick: '#8C96B8' };
export type Range = 'week' | 'month' | 'year';

export function rangeWindow(range: Range, period: Period) {
  const lastDay = new Date(period.year, period.month, 0);
  if (range === 'year') return { start: `${period.year}-01-01`, end: `${period.year}-12-31` };
  if (range === 'week') {
    const now = new Date();
    const isCurrent = now.getMonth() + 1 === period.month && now.getFullYear() === period.year;
    const end = isCurrent ? now : lastDay;
    return { start: toYmd(new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)), end: toYmd(end) };
  }
  return { start: toYmd(new Date(period.year, period.month - 1, 1)), end: toYmd(lastDay) };
}

export interface FlowPoint { key: string; label: string; income: number | null; expense: number | null }

export function buildSeries(txs: Transaction[], range: Range, period: Period): FlowPoint[] {
  const win = rangeWindow(range, period);
  const pts: FlowPoint[] = [];
  if (range === 'year') {
    for (let m = 1; m <= 12; m++) pts.push({ key: `${period.year}-${pad(m)}`, label: `T${m}`, income: 0, expense: 0 });
  } else {
    const cur = new Date(`${win.start}T00:00:00`);
    const end = new Date(`${win.end}T00:00:00`);
    while (cur <= end) {
      pts.push({ key: toYmd(cur), label: range === 'week' ? `${pad(cur.getDate())}/${pad(cur.getMonth() + 1)}` : String(cur.getDate()), income: 0, expense: 0 });
      cur.setDate(cur.getDate() + 1);
    }
  }
  const idx = new Map(pts.map((p, i) => [p.key, i]));
  txs.forEach(t => {
    if (isTransfer(t)) return;
    const day = dayKey(t.transaction_date);
    const i = idx.get(range === 'year' ? day.slice(0, 7) : day);
    if (i === undefined) return;
    if (t.category_type === 'INCOME') pts[i].income! += t.amount;
    else if (t.category_type === 'EXPENSE') pts[i].expense! += t.amount;
  });
  const today = toYmd(new Date());
  pts.forEach(p => {
    if (range === 'year' ? p.key > today.slice(0, 7) : p.key > today) { p.income = null; p.expense = null; }
  });
  return pts;
}

const tick = { fill: C.tick, fontSize: 12 };

function FlowTip({ active, payload, label, range }: any) {
  if (!active || !payload?.length) return null;
  const title = range === 'year' ? `Tháng ${String(label).slice(1)}` : range === 'month' ? `Ngày ${label}` : label;
  return (
    <div className="chart-tip">
      <div className="chart-tip__title">{title}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="chart-tip__row"><span className="dot" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} />{p.name}<strong>{money(p.value ?? 0)}</strong></div>
      ))}
    </div>
  );
}

export function FlowChart({ data, range, height = 320 }: { data: FlowPoint[]; range: Range; height?: number }) {
  return (
    <div style={{ width: '100%', height }} role="img" aria-label="Biểu đồ thu nhập và chi tiêu">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -6, bottom: 0 }}>
          <defs>
            <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.income} stopOpacity={0.35} /><stop offset="100%" stopColor={C.income} stopOpacity={0} /></linearGradient>
            <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.expense} stopOpacity={0.32} /><stop offset="100%" stopColor={C.expense} stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={C.grid} strokeDasharray="2 6" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={16} tick={tick} />
          <YAxis tickLine={false} axisLine={false} width={50} tickCount={5} tick={tick} tickFormatter={compact} />
          <Tooltip content={<FlowTip range={range} />} cursor={{ stroke: 'rgba(255,255,255,.22)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area className="glow-income" type="monotone" dataKey="income" name="Thu nhập" stroke={C.income} strokeWidth={2.6} fill="url(#gIn)" dot={false} activeDot={{ r: 6, stroke: '#0B1124', strokeWidth: 3 }} animationDuration={1100} />
          <Area className="glow-expense" type="monotone" dataKey="expense" name="Chi tiêu" stroke={C.expense} strokeWidth={2.6} fill="url(#gOut)" dot={false} activeDot={{ r: 6, stroke: '#0B1124', strokeWidth: 3 }} animationDuration={1100} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({ data, color }: { data: (number | null)[]; color: string }) {
  const rows = data.map((v, i) => ({ i, v }));
  const id = `sp${color.replace('#', '')}`;
  return (
    <div style={{ width: '100%', height: 52 }} aria-hidden>
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} animationDuration={900} style={{ filter: `drop-shadow(0 0 5px ${color}99)` }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface Slice { name: string; color: string; value: number }
function prepare(items: ReportItem[], key: 'actual_spent' | 'total'): Slice[] {
  const rows = items
    .map(i => ({ name: i.category_name, color: glowColor(i.category_color, nameStyle(i.category_name).color), value: Number(i[key] ?? i.total ?? i.actual_spent) || 0 }))
    .filter(r => r.value > 0).sort((a, b) => b.value - a.value);
  if (rows.length <= 8) return rows;
  const head = rows.slice(0, 7);
  head.push({ name: 'Danh mục khác', color: '#94A3B8', value: rows.slice(7).reduce((s, r) => s + r.value, 0) });
  return head;
}
const pct = (v: number, t: number) => `${((v / t) * 100).toFixed(1).replace('.', ',')}%`;

export function Donut({ items, valueKey = 'actual_spent', caption = 'Tổng chi', emptyTitle = 'Chưa có dữ liệu' }: {
  items: ReportItem[]; valueKey?: 'actual_spent' | 'total'; caption?: string; emptyTitle?: string;
}) {
  const rows = useMemo(() => prepare(items, valueKey), [items, valueKey]);
  const [active, setActive] = useState<number | undefined>();
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (!rows.length) return <Empty icon={PieIcon} compact title={emptyTitle} text="Dữ liệu sẽ xuất hiện khi có giao dịch trong kỳ này." />;
  const shown = active !== undefined ? rows[active] : null;
  return (
    <>
      <div className="donut" style={{ height: 230 }} role="img" aria-label={caption}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="94%" paddingAngle={3} cornerRadius={6} stroke="none" activeIndex={active}
              activeShape={(p: any) => <Sector {...p} outerRadius={p.outerRadius + 6} style={{ filter: `drop-shadow(0 0 10px ${p.fill})` }} />}
              onMouseEnter={(_, i) => setActive(i)} onMouseLeave={() => setActive(undefined)} animationDuration={900}>
              {rows.map(r => <Cell key={r.name} fill={r.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut__center">
          <span className="donut__cap">{shown ? shown.name : caption}</span>
          <span className="donut__val">{compact(shown ? shown.value : total)}</span>
          {shown && <span className="donut__cap">{pct(shown.value, total)}</span>}
        </div>
      </div>
      <ul className="keys mt-2">
        {rows.map((r, i) => (
          <li key={r.name} className={active === i ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(undefined)}>
            <span className="dot" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}88` }} /><span className="truncate">{r.name}</span><span className="pct">{pct(r.value, total)}</span><span className="val">{money(r.value)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function BudgetBars({ rows, height }: { rows: { name: string; spent: number; limit: number }[]; height: number }) {
  const color = (r: { spent: number; limit: number }) => { const p = r.limit > 0 ? (r.spent / r.limit) * 100 : 0; return p >= 100 ? C.expense : p >= 80 ? '#FBBF24' : C.blue; };
  return (
    <div style={{ width: '100%', height }} role="img" aria-label="So sánh hạn mức và chi tiêu thực tế">
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }} barGap={4}>
          <CartesianGrid horizontal={false} stroke={C.grid} strokeDasharray="2 6" />
          <XAxis type="number" tickLine={false} axisLine={false} tickCount={5} tick={tick} tickFormatter={compact} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} tick={{ ...tick, fill: '#EAF0FF' }} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,.04)' }} formatter={(v: number, n: string) => [money(v), n]} contentStyle={{ background: 'rgba(16,23,50,.96)', border: '1px solid rgba(255,255,255,.17)', borderRadius: 14 }} />
          <Bar dataKey="spent" name="Đã chi" radius={[0, 6, 6, 0]} barSize={14} animationDuration={900}>{rows.map(r => <Cell key={r.name} fill={color(r)} />)}</Bar>
          <Bar dataKey="limit" name="Hạn mức" fill="rgba(255,255,255,.12)" radius={[0, 6, 6, 0]} barSize={14} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompareBars({ labels, previous, current, previousLabel, currentLabel }: { labels: string[]; previous: number[]; current: number[]; previousLabel: string; currentLabel: string }) {
  const rows = labels.map((l, i) => ({ name: l, previous: previous[i], current: current[i] }));
  const palette = [C.income, C.expense];
  return (
    <div style={{ width: '100%', height: 250 }} role="img" aria-label="So sánh thu chi hai tháng">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -6, bottom: 0 }} barGap={8}>
          <CartesianGrid vertical={false} stroke={C.grid} strokeDasharray="2 6" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={tick} />
          <YAxis tickLine={false} axisLine={false} width={50} tickCount={5} tick={tick} tickFormatter={compact} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,.04)' }} formatter={(v: number, n: string) => [money(v), n]} contentStyle={{ background: 'rgba(16,23,50,.96)', border: '1px solid rgba(255,255,255,.17)', borderRadius: 14 }} />
          <Bar dataKey="previous" name={previousLabel} fill="rgba(255,255,255,.18)" radius={[8, 8, 0, 0]} maxBarSize={46} animationDuration={900} />
          <Bar dataKey="current" name={currentLabel} radius={[8, 8, 0, 0]} maxBarSize={46} animationDuration={900}>{rows.map((r, i) => <Cell key={r.name} fill={palette[i]} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
