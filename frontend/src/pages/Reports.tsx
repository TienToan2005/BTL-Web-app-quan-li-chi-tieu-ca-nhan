import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, BarChart3, FileSpreadsheet, FileText, PieChart as PieIcon, PiggyBank, Receipt, Scale } from 'lucide-react';
import { api } from '../lib/api';
import { formatDate, isTransfer, money, periodLabel, prevPeriod } from '../lib/format';
import { glowColor, nameStyle } from '../lib/icons';
import { useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { usePeriod } from '../context/PeriodContext';
import { useCategories, useReport, useTransactionsBetween } from '../hooks/queries';
import { buildSeries, CompareBars, Donut, FlowChart, rangeWindow } from '../components/charts';
import { GlowCard } from '../components/fx';
import { Badge, Delta, Empty, ErrorState, Money, PageHead, Rise, Skeleton, SkeletonRows, Stage, StatCard, StatSkeleton } from '../components/ui';
import { Glyph, storeIcon } from '../lib/icons';
import type { MonthlyReport } from '../types';

const pct1 = (n: number) => n.toFixed(1).replace('.', ',');

function CompareTable({ cur, prev }: { cur: MonthlyReport; prev: MonthlyReport }) {
  const rows = useMemo(() => {
    const map = new Map<string, { name: string; color?: string | null; cur: number; prev: number }>();
    cur.item_expenses.forEach(i => map.set(i.category_name, { name: i.category_name, color: i.category_color, cur: i.actual_spent ?? 0, prev: 0 }));
    prev.item_expenses.forEach(i => { const r = map.get(i.category_name) ?? { name: i.category_name, color: i.category_color, cur: 0, prev: 0 }; r.prev = i.actual_spent ?? 0; map.set(i.category_name, r); });
    return [...map.values()].sort((a, b) => b.cur - a.cur || b.prev - a.prev).slice(0, 8);
  }, [cur, prev]);
  if (!rows.length) return null;
  return (
    <div className="mt-2" style={{ border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
      {rows.map(x => (
        <div key={x.name} className="list-row" style={{ padding: '12px 16px' }}>
          <div className="grow"><Badge name={x.name} color={x.color} size="sm" /></div>
          <span className="muted fs-13 nowrap hide-m">{money(x.prev)}</span>
          <span className="nowrap" style={{ fontWeight: 600, minWidth: 100, textAlign: 'right' }}>{money(x.cur)}</span>
          <span style={{ minWidth: 76, textAlign: 'right' }}>{x.prev ? <Delta current={x.cur} previous={x.prev} inverse /> : x.cur ? <span className="pill pill--blue">Mới</span> : null}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return <GlowCard style={{ height: '100%' }}><h3 className="card__title">{title}</h3>{sub && <p className="card__sub mb-2">{sub}</p>}{!sub && <div className="mb-1" />}{children}</GlowCard>;
}

export default function Reports() {
  const user = useUser();
  const { toast } = useFeedback();
  const { period } = usePeriod();
  const prev = prevPeriod(period);
  const label = periodLabel(period);
  const prevLabel = periodLabel(prev);
  const cur = useReport(period);
  const prv = useReport(prev);
  const cats = useCategories();
  const m = rangeWindow('month', period);
  const y = rangeWindow('year', period);
  const monthTxs = useTransactionsBetween(m.start, m.end);
  const yearTxs = useTransactionsBetween(y.start, y.end);
  const trend = useMemo(() => buildSeries(yearTxs.data ?? [], 'year', period), [yearTxs.data, period]);
  const topTx = useMemo(() => (monthTxs.data ?? []).filter(t => t.category_type === 'EXPENSE' && !isTransfer(t)).sort((a, b) => b.amount - a.amount).slice(0, 5), [monthTxs.data]);
  const byName = new Map((cats.data ?? []).map(c => [c.name, c]));

  const r = cur.data; const p = prv.data;
  const income = r?.period_income ?? 0; const expense = r?.period_expenses ?? 0; const net = income - expense;
  const rate = income > 0 ? (net / income) * 100 : null;
  const prevRate = p && p.period_income > 0 ? ((p.period_income - p.period_expenses) / p.period_income) * 100 : null;
  const vs = (n: ReactNode) => (n ? <>{n}<span>so với tháng trước</span></> : <span>Chưa có dữ liệu tháng trước</span>);
  const topCats = [...(r?.item_expenses ?? [])].sort((a, b) => (b.actual_spent ?? 0) - (a.actual_spent ?? 0)).slice(0, 5);

  const exportFile = (f: 'excel' | 'pdf') => { toast('info', `Đang chuẩn bị tệp ${f.toUpperCase()}. Tệp sẽ mở trong tab mới.`); window.setTimeout(() => window.open(api.exportUrl(f, user.id), '_blank'), 600); };

  return (
    <Stage>
      <PageHead title="Báo cáo tài chính" desc={`${label}: thu chi, xu hướng và so sánh với ${prevLabel.toLowerCase()}.`}
        actions={<><button className="btn" onClick={() => exportFile('excel')}><FileSpreadsheet size={16} />Xuất Excel</button><button className="btn" onClick={() => exportFile('pdf')}><FileText size={16} />Xuất PDF</button></>} />

      {cur.isError ? <div className="card"><ErrorState error={cur.error} onRetry={() => cur.refetch()} /></div> : (
        <>
          <Rise className="mb-2">
            <div className="grid g-4">
              {cur.isLoading ? [1, 2, 3, 4].map(i => <StatSkeleton key={i} />) : (
                <>
                  <StatCard icon={ArrowDownLeft} tone="income" label="Tổng thu nhập" value={<Money value={income} />} foot={vs(p ? <Delta current={income} previous={p.period_income} /> : null)} />
                  <StatCard icon={ArrowUpRight} tone="expense" label="Tổng chi tiêu" value={<Money value={expense} />} foot={vs(p ? <Delta current={expense} previous={p.period_expenses} inverse /> : null)} />
                  <StatCard icon={Scale} tone="blue" label="Chênh lệch thu chi" value={<Money value={net} sign />} foot={vs(p ? <Delta current={net} previous={p.period_income - p.period_expenses} /> : null)} />
                  <StatCard icon={PiggyBank} tone="warn" label="Tỷ lệ tiết kiệm" value={rate === null ? <span className="money">—</span> : <span className="money">{pct1(rate)}<span className="cur">%</span></span>}
                    foot={rate === null ? <span>Chưa có thu nhập trong kỳ</span> : <span>{prevRate === null ? 'của thu nhập' : `Tháng trước ${pct1(prevRate)}%`}</span>} />
                </>
              )}
            </div>
          </Rise>

          <Rise className="mb-2">
            <div className="grid g-main">
              <Panel title="Xu hướng thu chi" sub={`Năm ${period.year}, theo tháng`}>
                {yearTxs.isLoading ? <Skeleton h={320} r={18} /> : yearTxs.isError ? <ErrorState error={yearTxs.error} onRetry={() => yearTxs.refetch()} /> : <FlowChart data={trend} range="year" />}
              </Panel>
              <Panel title="Chi tiêu theo danh mục" sub={label}>{cur.isLoading ? <Skeleton h={230} r={18} /> : <Donut items={r?.item_expenses ?? []} caption="Tổng chi" emptyTitle="Chưa có khoản chi" />}</Panel>
            </div>
          </Rise>

          <Rise className="mb-2">
            <div className="grid g-split">
              <Panel title="So sánh với tháng trước" sub={`${label} và ${prevLabel}`}>
                {!p || !r ? <Empty compact icon={BarChart3} title="Chưa có dữ liệu tháng trước" /> : (
                  <><CompareBars labels={['Thu nhập', 'Chi tiêu']} previous={[p.period_income, p.period_expenses]} current={[r.period_income, r.period_expenses]} previousLabel={prevLabel} currentLabel={label} /><CompareTable cur={r} prev={p} /></>
                )}
              </Panel>
              <Panel title="Thu nhập theo danh mục" sub={label}>{cur.isLoading ? <Skeleton h={230} r={18} /> : <Donut items={r?.item_incomes ?? []} valueKey="total" caption="Tổng thu" emptyTitle="Chưa có khoản thu" />}</Panel>
            </div>
          </Rise>

          <Rise>
            <div className="grid g-2">
              <Panel title="Khoản chi lớn nhất" sub={label}>
                {monthTxs.isLoading ? <SkeletonRows n={3} /> : topTx.length === 0 ? <Empty compact icon={Receipt} title="Chưa có khoản chi trong kỳ" /> : (
                  <div>{topTx.map(t => {
                    const s = nameStyle(t.category_name);
                    return (
                      <div className="list-row" style={{ padding: '12px 0' }} key={t.id}>
                        <span className="glyph" style={{ ['--c' as string]: glowColor(t.category_color, s.color) }}><Glyph name={t.category_icon && !/tag$/.test(t.category_icon) ? t.category_icon : storeIcon(s.key)} size={19} /></span>
                        <div className="grow"><div className="tx__title">{t.note?.trim() ? t.note.trim() : t.category_name}</div><div className="tx__sub">{t.category_name} · {formatDate(t.transaction_date)}</div></div>
                        <div className="amount amount--expense">−{money(t.amount)}</div>
                      </div>
                    );
                  })}</div>
                )}
              </Panel>
              <Panel title="Danh mục tiêu nhiều nhất" sub={label}>
                {cur.isLoading ? <Skeleton h={160} r={18} /> : topCats.length === 0 ? <Empty compact icon={PieIcon} title="Chưa có chi tiêu trong kỳ" /> : topCats.map(x => {
                  const share = expense > 0 ? ((x.actual_spent ?? 0) / expense) * 100 : 0;
                  const c = byName.get(x.category_name);
                  const col = glowColor(x.category_color, nameStyle(x.category_name).color);
                  return (
                    <div className="brow" key={x.category_name}>
                      <div className="row between mb-1"><Badge name={x.category_name} color={x.category_color} icon={c?.icon} /><strong className="nowrap">{money(x.actual_spent ?? 0)}</strong></div>
                      <div className="bar"><motion.div className="bar__fill" style={{ background: col, boxShadow: `0 0 14px ${col}99` }} initial={{ width: 0 }} animate={{ width: `${share}%` }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} /></div>
                      <div className="fs-13 muted" style={{ marginTop: 6 }}>{pct1(share)}% tổng chi tiêu</div>
                    </div>
                  );
                })}
              </Panel>
            </div>
          </Rise>
        </>
      )}
    </Stage>
  );
}
