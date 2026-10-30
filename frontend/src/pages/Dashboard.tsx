import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChartPie, Plus, Receipt, Sparkles, ArrowLeftRight } from 'lucide-react';
import { useUser } from '../context/AuthContext';
import { usePeriod } from '../context/PeriodContext';
import { useAdvice, useBudgets, useCategories, useReport, useTransactionsBetween, useWallets } from '../hooks/queries';
import { useNow, useTypewriter } from '../hooks/ui';
import { compact, money, periodLabel, prevPeriod } from '../lib/format';
import { Glyph } from '../lib/icons';
import { AnimatedMoney, GlowCard } from '../components/fx';
import { Badge, Bar, budgetState, Delta, Empty, ErrorState, Money, PageHead, Rise, Segmented, Skeleton, SkeletonRows, Stage, StatCard, StatSkeleton } from '../components/ui';
import { buildSeries, C, Donut, FlowChart, rangeWindow, Sparkline, type Range } from '../components/charts';
import { TransactionList } from '../components/TransactionList';
import { useTxModals } from '../components/TransactionModals';
import { AIChat } from '../components/AIChat';

const greeting = (h: number) => (h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối');

function Hero() {
  const { period } = usePeriod();
  const wallets = useWallets();
  const report = useReport(period);

  if (wallets.isLoading || report.isLoading) {
    return <div className="card hero"><div><Skeleton w={120} className="mb-2" /><Skeleton w="min(360px,100%)" h={64} r={14} /></div><div><Skeleton w={160} className="mb-2" /><Skeleton h={44} r={14} /></div></div>;
  }
  if (wallets.isError && report.isError) return <div className="card"><ErrorState error={wallets.error} onRetry={() => { wallets.refetch(); report.refetch(); }} /></div>;

  const list = wallets.data ?? [];
  const total = list.reduce((s, w) => s + w.balance, 0);
  const income = report.data?.period_income ?? 0;
  const expense = report.data?.period_expenses ?? 0;
  const saved = report.data?.period_change ?? income - expense;
  const rate = income > 0 ? Math.round((saved / income) * 100) : null;
  const peak = Math.max(income, expense, 1);

  return (
    <GlowCard className="hero" tilt>
      <span className="hero__rim" /><span className="hero__orb" />
      <div>
        <div className="hero__label">Tổng số dư</div>
        <div className="hero__amount"><AnimatedMoney value={total} /></div>
        <div className="chips">
          {list.map((w, i) => (
            <Link key={w.id} className="chip" to="/settings/wallet" style={{ ['--d' as string]: `${i * -1.3}s` }}>
              <span className="chip__icon"><Glyph name={w.icon} size={15} /></span>{w.name}<b>{compact(w.balance)}</b>
            </Link>
          ))}
          {list.length === 0 && <Link className="chip" to="/settings/wallet"><span className="chip__icon"><Plus size={15} /></span>Thêm ví đầu tiên</Link>}
        </div>
      </div>
      <div>
        <div className="hero__label">Giữ lại trong {periodLabel(period).toLowerCase()}</div>
        <div className="saved"><AnimatedMoney value={saved} sign /> <span className="muted fs-13" style={{ fontFamily: 'var(--font)', fontWeight: 500, letterSpacing: 0 }}>{rate === null ? 'chưa có thu nhập' : `${rate}% thu nhập`}</span></div>
        <div className="flow" aria-label="So sánh thu và chi trong kỳ">
          {[['Thu', income, 'in'], ['Chi', expense, 'out']].map(([label, v, k], i) => (
            <div className="flow__row" key={String(label)}>
              <span>{label}</span>
              <div className="flow__track"><motion.div className={`flow__bar flow__bar--${k}`} initial={{ width: 0 }} animate={{ width: `${((v as number) / peak) * 100}%` }} transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }} /></div>
              <span className="fs-12">{compact(v as number)}</span>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}

function Stats() {
  const { period } = usePeriod();
  const report = useReport(period);
  const prev = useReport(prevPeriod(period));
  const budgets = useBudgets(period);
  const win = rangeWindow('month', period);
  const txs = useTransactionsBetween(win.start, win.end);
  const series = useMemo(() => buildSeries(txs.data ?? [], 'month', period), [txs.data, period]);

  if (report.isLoading) return <>{[1, 2, 3].map(i => <StatSkeleton key={i} />)}</>;
  const income = report.data?.period_income ?? 0;
  const expense = report.data?.period_expenses ?? 0;
  const p = prev.data;
  const list = budgets.data ?? [];
  const limit = list.reduce((s, b) => s + b.amount_limit, 0);
  const spent = list.reduce((s, b) => s + b.actual_spent, 0);
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  const bs = budgetState(pct);
  const vs = (n: ReactNode) => (n ? <>{n}<span>so với tháng trước</span></> : <span>Chưa có dữ liệu tháng trước</span>);

  return (
    <>
      <StatCard icon={ArrowDownLeft} tone="income" label="Thu nhập" value={<Money value={income} />} foot={vs(p ? <Delta current={income} previous={p.period_income} /> : null)} spark={<Sparkline data={series.map(s => s.income)} color={C.income} />} />
      <StatCard icon={ArrowUpRight} tone="expense" label="Chi tiêu" value={<Money value={expense} />} foot={vs(p ? <Delta current={expense} previous={p.period_expenses} inverse /> : null)} spark={<Sparkline data={series.map(s => s.expense)} color={C.expense} />} />
      <StatCard icon={ChartPie} tone={bs.key === 'ok' ? 'blue' : bs.key === 'over' ? 'expense' : 'warn'} label="Ngân sách đã dùng"
        value={limit > 0 ? <span className="money">{Math.round(pct)}<span className="cur">%</span></span> : <span className="money">—</span>}
        foot={limit > 0 ? <span>{money(spent)} / {money(limit)}</span> : <Link to="/budgets" className="link">Đặt ngân sách đầu tiên</Link>}
        spark={limit > 0 ? <div style={{ paddingTop: 18 }}><Bar pct={pct} state={bs.key} /></div> : undefined} />
    </>
  );
}

function Advice() {
  const { period } = usePeriod();
  const q = useAdvice(period);
  const text = q.isLoading ? undefined : q.data?.advice || 'Hãy thêm giao dịch để mình có dữ liệu tư vấn nhé.';
  const shown = useTypewriter(text);
  return (
    <GlowCard className="card--tight">
      <div className="row" style={{ alignItems: 'flex-start', gap: 16 }}>
        <span className="stat__icon stat__icon--blue" style={{ width: 44, height: 44 }}><Sparkles size={20} /></span>
        <div className="grow">
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>Gợi ý tài chính từ AI</h3>
          <p className="muted" style={{ lineHeight: 1.65, maxWidth: '80ch' }}>{q.isLoading ? <Skeleton w="min(520px,100%)" /> : shown}</p>
        </div>
      </div>
    </GlowCard>
  );
}

function FlowCard() {
  const { period } = usePeriod();
  const [range, setRange] = useState<Range>('month');
  const win = rangeWindow(range, period);
  const q = useTransactionsBetween(win.start, win.end);
  const data = useMemo(() => buildSeries(q.data ?? [], range, period), [q.data, range, period]);
  const sub = range === 'week' ? '7 ngày gần nhất của kỳ' : range === 'month' ? periodLabel(period) : `Năm ${period.year}`;
  return (
    <GlowCard style={{ height: '100%' }}>
      <div className="card__head">
        <div><h3 className="card__title">Thu nhập và chi tiêu</h3><p className="card__sub">{sub}</p></div>
        <Segmented layoutId="seg-range" value={range} onChange={setRange} options={[{ value: 'week', label: 'Tuần' }, { value: 'month', label: 'Tháng' }, { value: 'year', label: 'Năm' }]} />
      </div>
      {q.isLoading ? <Skeleton h={320} r={18} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : (
        <>
          <div className="legend" style={{ justifyContent: 'flex-end' }}>
            <span><i className="dot" style={{ background: C.income, boxShadow: `0 0 10px ${C.income}` }} />Thu nhập</span>
            <span><i className="dot" style={{ background: C.expense, boxShadow: `0 0 10px ${C.expense}` }} />Chi tiêu</span>
          </div>
          <FlowChart data={data} range={range} />
        </>
      )}
    </GlowCard>
  );
}

export default function Dashboard() {
  const user = useUser();
  const { period } = usePeriod();
  const now = useNow();
  const { openTransfer, openAdd } = useTxModals();
  const report = useReport(period);
  const win = rangeWindow('month', period);
  const txs = useTransactionsBetween(win.start, win.end);
  const budgets = useBudgets(period);
  const cats = useCategories();

  const recent = (txs.data ?? []).slice(0, 6);
  const byName = new Map((cats.data ?? []).map(c => [c.name, c]));
  const top = [...(budgets.data ?? [])].map(b => ({ ...b, pct: b.amount_limit > 0 ? (b.actual_spent / b.amount_limit) * 100 : 0 })).sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <Stage>
      <PageHead title={`${greeting(now.getHours())}, ${user.username}`}
        desc={`${now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
        actions={<button className="btn" onClick={openTransfer}><ArrowLeftRight size={16} />Chuyển tiền</button>} />

      <Rise className="mb-2"><Hero /></Rise>
      <Rise className="mb-2"><div className="grid g-3"><Stats /></div></Rise>
      <Rise className="mb-2"><Advice /></Rise>

      <Rise className="mb-2">
        <div className="grid g-main">
          <FlowCard />
          <GlowCard style={{ height: '100%' }}>
            <h3 className="card__title">Chi tiêu theo danh mục</h3><p className="card__sub mb-2">{periodLabel(period)}</p>
            {report.isLoading ? <Skeleton h={230} r={18} /> : report.isError ? <ErrorState error={report.error} onRetry={() => report.refetch()} /> : <Donut items={report.data?.item_expenses ?? []} caption="Tổng chi" emptyTitle="Chưa có khoản chi" />}
          </GlowCard>
        </div>
      </Rise>

      <Rise className="mb-2">
        <GlowCard className="card--flush">
          <div className="card__head" style={{ padding: '22px 24px 6px', marginBottom: 0 }}>
            <div><h3 className="card__title">Giao dịch gần đây</h3><p className="card__sub">{periodLabel(period)}</p></div>
            <Link to="/transactions" className="link">Xem tất cả giao dịch <ArrowRight size={15} /></Link>
          </div>
          {txs.isLoading ? <SkeletonRows /> : txs.isError ? <ErrorState error={txs.error} onRetry={() => txs.refetch()} />
            : recent.length === 0 ? <Empty icon={Receipt} title="Chưa có giao dịch trong kỳ này" text="Ghi lại khoản thu hoặc chi đầu tiên để xem tổng quan ở đây." action={<button className="btn btn--primary btn--sm" onClick={() => openAdd()}><Plus size={16} />Thêm giao dịch</button>} />
            : <TransactionList items={recent} />}
        </GlowCard>
      </Rise>

      <Rise>
        <GlowCard>
          <div className="card__head">
            <div><h3 className="card__title">Ngân sách theo danh mục</h3><p className="card__sub">{periodLabel(period)}</p></div>
            <Link to="/budgets" className="link">Quản lý ngân sách <ArrowRight size={15} /></Link>
          </div>
          {budgets.isLoading ? <><Skeleton className="mb-2" h={16} /><Skeleton className="mb-2" h={16} /><Skeleton h={16} /></> : budgets.isError ? <ErrorState error={budgets.error} onRetry={() => budgets.refetch()} />
            : top.length === 0 ? <Empty icon={ChartPie} title="Chưa có ngân sách cho kỳ này" text="Đặt hạn mức cho từng danh mục để được cảnh báo khi sắp chi quá tay." action={<Link className="btn btn--primary btn--sm" to="/budgets"><Plus size={16} />Thiết lập ngân sách</Link>} />
            : (
              <div className="grid g-2" style={{ columnGap: 48, rowGap: 22 }}>
                {top.map(b => {
                  const c = byName.get(b.category_name);
                  const st = budgetState(b.pct);
                  return (
                    <div key={b.id}>
                      <div className="row between mb-1"><Badge name={b.category_name} color={c?.color} icon={c?.icon} />{st.text && <span className={`pill ${st.pill}`}>{st.text}</span>}</div>
                      <Bar pct={b.pct} state={st.key} />
                      <div className="row between fs-13 muted" style={{ marginTop: 8 }}><span><strong style={{ color: 'var(--text)' }}>{money(b.actual_spent)}</strong> / {money(b.amount_limit)}</span><span>{Math.round(b.pct)}%</span></div>
                    </div>
                  );
                })}
              </div>
            )}
        </GlowCard>
      </Rise>
      <AIChat />
    </Stage>
  );
}
