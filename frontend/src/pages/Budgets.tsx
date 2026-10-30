import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChartPie, Pencil, PiggyBank, Plus, Target, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';
import { formatMoneyInput, money, parseMoneyInput, periodLabel } from '../lib/format';
import { useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { usePeriod } from '../context/PeriodContext';
import { useBudgets, useCategories, useRefreshMoney } from '../hooks/queries';
import { BudgetBars } from '../components/charts';
import { GlowCard } from '../components/fx';
import { Badge, budgetState, Empty, ErrorState, Field, Input, Modal, Money, PageHead, Ring, Rise, Select, Skeleton, Spinner, Stage, StatCard, StatSkeleton } from '../components/ui';
import type { Budget } from '../types';

export default function Budgets() {
  const user = useUser();
  const nav = useNavigate();
  const { toast } = useFeedback();
  const { period } = usePeriod();
  const refresh = useRefreshMoney();
  const budgets = useBudgets(period);
  const categories = useCategories();
  const [editing, setEditing] = useState<Budget | 'new' | null>(null);

  const items = budgets.data ?? [];
  const limit = items.reduce((s, b) => s + b.amount_limit, 0);
  const spent = items.reduce((s, b) => s + b.actual_spent, 0);
  const remaining = limit - spent;
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  const st = budgetState(pct);
  const withPct = items.map(b => ({ ...b, pct: b.amount_limit > 0 ? (b.actual_spent / b.amount_limit) * 100 : 0 })).sort((a, b) => b.pct - a.pct);
  const over = withPct.filter(b => b.pct >= 100);
  const near = withPct.filter(b => b.pct >= 80 && b.pct < 100);
  const byName = new Map((categories.data ?? []).map(c => [c.name, c]));

  function open(b: Budget | 'new') {
    if (!categories.isSuccess) return;
    if (!categories.data.some(c => c.type === 'EXPENSE')) { toast('warning', 'Bạn cần tạo danh mục chi tiêu trước khi đặt ngân sách.'); nav('/settings/category'); return; }
    setEditing(b);
  }

  return (
    <Stage>
      <PageHead title="Ngân sách chi tiêu" desc={`${periodLabel(period)}: đặt hạn mức cho từng danh mục và theo dõi mức đã dùng.`}
        actions={<button className="btn btn--primary" onClick={() => open('new')}><Plus size={17} />Thiết lập ngân sách</button>} />

      {(over.length > 0 || near.length > 0) && (
        <Rise className="mb-2"><div className={`banner ${over.length ? 'banner--error' : 'banner--warn'}`} role="status" style={{ marginBottom: 0 }}>
          <AlertTriangle size={19} />
          <span>
            {over.length > 0 && <><strong>{over.length} danh mục đã vượt ngân sách</strong> ({over.map(b => b.category_name).join(', ')}). </>}
            {near.length > 0 && <><strong>{near.length} danh mục đã dùng từ 80%</strong> ({near.map(b => b.category_name).join(', ')}).</>}
          </span>
        </div></Rise>
      )}

      <Rise className="mb-2">
        <div className="grid g-3">
          {budgets.isLoading ? [1, 2, 3].map(i => <StatSkeleton key={i} />) : (
            <>
              <StatCard icon={Target} tone="blue" label="Tổng ngân sách tháng" value={<Money value={limit} />} foot={<span>{items.length} danh mục có hạn mức</span>} />
              <StatCard icon={ArrowUpRight} tone="expense" label="Tổng đã chi" value={<Money value={spent} />} foot={<span>{limit > 0 ? `${Math.round(pct)}% tổng ngân sách` : 'Chưa có ngân sách'}</span>} />
              <StatCard icon={PiggyBank} tone={remaining < 0 ? 'expense' : 'income'} label="Ngân sách còn lại" value={<Money value={remaining} />}
                foot={st.text ? <span className={`pill ${st.pill}`}>{st.text}</span> : <span>{limit > 0 ? 'Trong tầm kiểm soát' : ''}</span>} />
            </>
          )}
        </div>
      </Rise>

      <Rise className="mb-2">
        <h3 className="card__title mb-1">Theo từng danh mục</h3>
        {budgets.isLoading ? <div className="grid g-3">{[1, 2, 3].map(i => <div key={i} className="card"><Skeleton w="50%" className="mb-2" /><Skeleton h={90} r={18} /></div>)}</div>
          : budgets.isError ? <div className="card"><ErrorState error={budgets.error} onRetry={() => budgets.refetch()} /></div>
          : items.length === 0 ? <div className="card"><Empty icon={ChartPie} title={`Chưa có ngân sách cho ${periodLabel(period).toLowerCase()}`} text="Đặt hạn mức cho các danh mục bạn hay chi tiêu để được cảnh báo khi sắp vượt." action={<button className="btn btn--primary btn--sm" onClick={() => open('new')}><Plus size={16} />Thiết lập ngân sách</button>} /></div>
          : (
            <div className="grid g-3">
              {withPct.map(b => {
                const c = byName.get(b.category_name);
                const s = budgetState(b.pct);
                const left = b.amount_limit - b.actual_spent;
                return (
                  <GlowCard key={b.id} className="bcard" tilt>
                    <div className="row between">
                      <Badge name={b.category_name} color={c?.color} icon={c?.icon} />
                      <button className="btn btn--ghost btn--icon btn--sm" onClick={() => open(b)} aria-label={`Sửa ngân sách ${b.category_name}`} title="Sửa hạn mức"><Pencil size={15} /></button>
                    </div>
                    <div className="row" style={{ gap: 20 }}>
                      <Ring pct={b.pct} state={s.key} />
                      <div style={{ minWidth: 0 }}>
                        <div className="bcard__amt">{money(b.actual_spent)}</div>
                        <div className="muted fs-13">trên hạn mức {money(b.amount_limit)}</div>
                      </div>
                    </div>
                    <div className="row between fs-13" style={{ marginTop: 'auto' }}>
                      <span className={left < 0 ? 'text-expense' : 'muted'}>{left >= 0 ? 'Còn lại' : 'Vượt'} <strong>{money(Math.abs(left))}</strong></span>
                      {s.text && <span className={`pill ${s.pill}`}>{s.text}</span>}
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          )}
      </Rise>

      {items.length > 0 && (
        <Rise>
          <GlowCard>
            <h3 className="card__title">Hạn mức và thực tế</h3><p className="card__sub mb-2">Thanh màu là số đã chi, thanh mờ là hạn mức.</p>
            <BudgetBars rows={items.map(b => ({ name: b.category_name, spent: b.actual_spent, limit: b.amount_limit }))} height={Math.max(260, items.length * 56 + 70)} />
          </GlowCard>
        </Rise>
      )}

      {editing && <BudgetModal budget={editing === 'new' ? null : editing} existing={items} userId={user.id} onClose={() => setEditing(null)}
        onSaved={async msg => { await refresh(); setEditing(null); toast('success', msg, 'Đã lưu'); }} />}
    </Stage>
  );
}

function BudgetModal({ budget, existing, userId, onClose, onSaved }: { budget: Budget | null; existing: Budget[]; userId: number; onClose: () => void; onSaved: (m: string) => void }) {
  const { period } = usePeriod();
  const categories = useCategories();
  const expense = (categories.data ?? []).filter(c => c.type === 'EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState(budget ? formatMoneyInput(String(budget.amount_limit)) : '');
  const [errors, setErrors] = useState<{ category?: string; amount?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (budget && expense.length && !categoryId) { const c = expense.find(x => x.name === budget.category_name); if (c) setCategoryId(String(c.id)); }
  }, [budget, expense, categoryId]);

  const has = new Set(existing.map(b => b.category_name));
  const selected = expense.find(c => String(c.id) === categoryId)?.name;
  const willUpdate = !budget && !!selected && has.has(selected);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    const raw = parseMoneyInput(amount);
    if (!categoryId) next.category = 'Chọn danh mục.';
    if (raw <= 0) next.amount = 'Hạn mức phải lớn hơn 0.';
    setErrors(next); setSubmitError('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await api.saveBudget({ user_id: userId, category_id: Number(categoryId), amount: raw, month: period.month, year: period.year }); onSaved(budget ? 'Đã cập nhật hạn mức.' : 'Đã thiết lập ngân sách.'); }
    catch (err) { setSubmitError(err instanceof Error ? err.message : 'Không lưu được ngân sách.'); }
    finally { setBusy(false); }
  }

  return (
    <Modal onClose={onClose} title={budget ? 'Sửa hạn mức ngân sách' : 'Thiết lập ngân sách'}
      footer={<><button className="btn" type="button" onClick={onClose}>Hủy</button><button className="btn btn--primary" type="submit" form="budget-form" disabled={busy}>{busy && <Spinner />}Lưu ngân sách</button></>}>
      <form id="budget-form" onSubmit={submit} noValidate className="grid" style={{ gap: 16 }}>
        <Field label="Danh mục chi tiêu" error={errors.category} hint={willUpdate ? 'Danh mục này đã có hạn mức. Lưu sẽ cập nhật hạn mức mới.' : undefined}>
          {id => (
            <Select id={id} invalid={!!errors.category} value={categoryId} disabled={!!budget} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Chọn danh mục</option>
              {expense.map(c => <option key={c.id} value={c.id}>{c.name}{has.has(c.name) && !budget ? ' · đã có hạn mức' : ''}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Hạn mức tháng này" error={errors.amount} hint={`Áp dụng cho ${periodLabel(period)}.`}>
          {id => <div className="money-input"><Input id={id} inputMode="numeric" placeholder="0" autoComplete="off" autoFocus invalid={!!errors.amount} value={amount} onChange={e => setAmount(formatMoneyInput(e.target.value))} /></div>}
        </Field>
        {submitError && <div className="banner banner--error" role="alert"><AlertTriangle size={18} /><span>{submitError}</span></div>}
      </form>
    </Modal>
  );
}
