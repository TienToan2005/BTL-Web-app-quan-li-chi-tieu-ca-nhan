import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText, Plus, Receipt, RotateCcw, Search, ArrowLeftRight } from 'lucide-react';
import { api } from '../lib/api';
import { isTransfer, money } from '../lib/format';
import { useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { useCategories, useRefreshMoney, useWallets } from '../hooks/queries';
import { useDebounced } from '../hooks/ui';
import { GlowCard } from '../components/fx';
import { Empty, ErrorState, Field, Input, Modal, PageHead, Rise, Select, SkeletonRows, Stage } from '../components/ui';
import { TransactionList, type Sort, type SortKey } from '../components/TransactionList';
import { useTxModals } from '../components/TransactionModals';
import type { Transaction, TxFilterType } from '../types';

const SIZE = 10;
const TABS: { value: TxFilterType; label: string; param: string | null }[] = [
  { value: 'ALL', label: 'Tất cả', param: null }, { value: 'INCOME', label: 'Khoản thu', param: 'income' }, { value: 'EXPENSE', label: 'Khoản chi', param: 'expense' },
];
const LEADS: Record<TxFilterType, string> = { ALL: 'Tất cả giao dịch', INCOME: 'Khoản thu', EXPENSE: 'Khoản chi' };

export default function Transactions() {
  const user = useUser();
  const { toast, confirm } = useFeedback();
  const { openAdd, openTransfer } = useTxModals();
  const refresh = useRefreshMoney();
  const wallets = useWallets();
  const categories = useCategories();
  const [params, setParams] = useSearchParams();
  const type: TxFilterType = params.get('type') === 'income' ? 'INCOME' : params.get('type') === 'expense' ? 'EXPENSE' : 'ALL';

  const [search, setSearch] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [sort, setSort] = useState<Sort>({ key: 'date', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [receipt, setReceipt] = useState('');
  const note = useDebounced(search.trim());

  useEffect(() => { document.title = `${LEADS[type]} - Zero-G Budget`; }, [type]);

  const rangeInvalid = !!(start && end && start > end);
  const query = useQuery({
    queryKey: ['transactions', user.id, 'list', note, walletId, categoryId, start, end],
    enabled: !rangeInvalid,
    queryFn: () => {
      const q: Record<string, string | number> = { user_id: user.id };
      if (note) q.note = note; if (walletId) q.wallet_id = walletId; if (categoryId) q.category_id = categoryId;
      if (start) q.start_date = start; if (end) q.end_date = end;
      return api.transactions(q);
    },
  });

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (type !== 'ALL') list = list.filter(t => t.category_type === type && !isTransfer(t));
    const m = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => (sort.key === 'amount' ? (a.amount - b.amount) * m : String(a.transaction_date).localeCompare(String(b.transaction_date)) * m) || (a.id - b.id) * m);
  }, [query.data, type, sort]);

  const real = filtered.filter(t => !isTransfer(t));
  const income = real.filter(t => t.category_type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const expense = real.filter(t => t.category_type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const pages = Math.max(1, Math.ceil(filtered.length / SIZE));
  const current = Math.min(page, pages);
  const from = (current - 1) * SIZE;
  const visible = filtered.slice(from, from + SIZE);
  const cats = (categories.data ?? []).filter(c => c.name !== 'Chuyển khoản');
  const catOptions = type === 'ALL' ? cats : cats.filter(c => c.type === type);
  const hasFilter = !!(search || start || end || categoryId || walletId) || type !== 'ALL';

  const setType = (t: TxFilterType) => { const p = TABS.find(x => x.value === t)?.param; setParams(p ? { type: p } : {}, { replace: true }); setPage(1); setCategoryId(''); };
  const toggleSort = (key: SortKey) => { setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' })); setPage(1); };
  const reset = () => { setSearch(''); setStart(''); setEnd(''); setCategoryId(''); setWalletId(''); setSort({ key: 'date', dir: 'desc' }); setPage(1); };

  async function remove(tx: Transaction) {
    if (!await confirm({ title: 'Xóa giao dịch này?', text: 'Số dư của ví sẽ được tính lại. Thao tác này không thể hoàn tác.', confirmText: 'Xóa giao dịch', danger: true })) return;
    try { await api.deleteTransaction(tx.id, user.id); await refresh(); toast('success', 'Giao dịch đã được xóa.', 'Đã xóa'); }
    catch (e) { toast('error', e instanceof Error ? e.message : 'Không xóa được giao dịch.'); }
  }
  function exportFile(format: 'excel' | 'pdf') {
    toast('info', `Đang chuẩn bị tệp ${format.toUpperCase()}. Tệp sẽ mở trong tab mới.`);
    window.setTimeout(() => window.open(api.exportUrl(format, user.id), '_blank'), 600);
  }

  const pageNums = (() => {
    const set = new Set([1, pages, current - 1, current, current + 1]);
    const seq = [...set].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
    const out: (number | 'gap')[] = [];
    seq.forEach((n, i) => { if (i && n - seq[i - 1] > 1) out.push('gap'); out.push(n); });
    return out;
  })();

  return (
    <Stage>
      <PageHead title={LEADS[type]} desc="Tìm, lọc và quản lý mọi khoản thu chi của bạn."
        actions={<>
          <Dropdown.Root>
            <Dropdown.Trigger asChild><button className="btn"><Download size={16} />Xuất báo cáo</button></Dropdown.Trigger>
            <Dropdown.Portal><Dropdown.Content className="surface menu" sideOffset={8} align="end">
              <Dropdown.Item className="menu__item" onSelect={() => exportFile('excel')}><FileSpreadsheet size={17} />Xuất Excel</Dropdown.Item>
              <Dropdown.Item className="menu__item" onSelect={() => exportFile('pdf')}><FileText size={17} />Xuất PDF</Dropdown.Item>
            </Dropdown.Content></Dropdown.Portal>
          </Dropdown.Root>
          <button className="btn" onClick={openTransfer}><ArrowLeftRight size={16} />Chuyển tiền</button>
          <button className="btn btn--primary" onClick={() => openAdd(type === 'INCOME' ? 'INCOME' : 'EXPENSE')}><Plus size={17} />Thêm giao dịch</button>
        </>} />

      <Rise>
        <div className="tabs" role="tablist">
          {TABS.map(t => (
            <button key={t.value} role="tab" aria-selected={type === t.value} className={`tabs__btn ${type === t.value ? 'is-active' : ''}`} onClick={() => setType(t.value)}>
              {t.label}{type === t.value && <motion.span layoutId="tx-tab" className="tabs__line" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            </button>
          ))}
        </div>
      </Rise>

      <Rise className="mb-2">
        <GlowCard className="card--flush"><div className="strip">
          <div><div className="strip__label">Thu nhập</div><div className="strip__value text-income">{query.isSuccess ? money(income) : '—'}</div></div>
          <div><div className="strip__label">Chi tiêu</div><div className="strip__value text-expense">{query.isSuccess ? money(expense) : '—'}</div></div>
          <div><div className="strip__label">Số giao dịch</div><div className="strip__value">{query.isSuccess ? filtered.length.toLocaleString('vi-VN') : '—'}</div></div>
        </div></GlowCard>
      </Rise>

      <Rise className="mb-2">
        <GlowCard className="card--tight">
          <div className="filters">
            <Field label="Tìm giao dịch">{id => <div className="input-affix"><Search size={17} /><Input id={id} type="search" placeholder="Tìm theo ghi chú" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>}</Field>
            <Field label="Từ ngày">{id => <Input id={id} type="date" value={start} onChange={e => { setStart(e.target.value); setPage(1); }} />}</Field>
            <Field label="Đến ngày" error={rangeInvalid ? 'Phải sau ngày bắt đầu.' : undefined}>{id => <Input id={id} type="date" invalid={rangeInvalid} value={end} onChange={e => { setEnd(e.target.value); setPage(1); }} />}</Field>
            <Field label="Danh mục">{id => <Select id={id} value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1); }}><option value="">Tất cả</option>{catOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>}</Field>
            <Field label="Ví">{id => <Select id={id} value={walletId} onChange={e => { setWalletId(e.target.value); setPage(1); }}><option value="">Tất cả</option>{(wallets.data ?? []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</Select>}</Field>
          </div>
          <div className="row between wrap mt-2">
            <div style={{ minWidth: 220 }}>
              <Field label="Sắp xếp">{id => (
                <Select id={id} value={`${sort.key}:${sort.dir}`} onChange={e => { const [key, dir] = e.target.value.split(':'); setSort({ key: key as SortKey, dir: dir as Sort['dir'] }); setPage(1); }}>
                  <option value="date:desc">Mới nhất trước</option><option value="date:asc">Cũ nhất trước</option>
                  <option value="amount:desc">Số tiền cao đến thấp</option><option value="amount:asc">Số tiền thấp đến cao</option>
                </Select>)}</Field>
            </div>
            <button className="btn btn--ghost" onClick={reset}><RotateCcw size={16} />Xóa bộ lọc</button>
          </div>
        </GlowCard>
      </Rise>

      <Rise>
        <GlowCard className="card--flush">
          {query.isLoading ? <SkeletonRows n={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => query.refetch()} />
            : filtered.length === 0 ? (
              <Empty icon={Receipt} title={hasFilter ? 'Không có giao dịch phù hợp' : 'Chưa có giao dịch nào'} text={hasFilter ? 'Thử đổi hoặc xóa bớt bộ lọc để xem thêm kết quả.' : 'Ghi lại khoản thu hoặc chi đầu tiên của bạn.'}
                action={hasFilter ? <button className="btn btn--sm" onClick={() => { reset(); setType('ALL'); }}>Xóa bộ lọc</button> : <button className="btn btn--primary btn--sm" onClick={() => openAdd()}><Plus size={16} />Thêm giao dịch</button>} />
            ) : (
              <>
                <TransactionList items={visible} netItems={filtered} group={sort.key === 'date'} sort={sort} onSort={toggleSort} onDelete={remove} onReceipt={setReceipt} />
                <div className="row between wrap" style={{ padding: '16px 22px', borderTop: '1px solid var(--line)' }}>
                  <span className="fs-13 muted">Hiển thị {from + 1}–{Math.min(from + SIZE, filtered.length)} trên {filtered.length.toLocaleString('vi-VN')} giao dịch</span>
                  <nav className="pager" aria-label="Phân trang giao dịch">
                    <button className="pager__btn" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Trang trước"><ChevronLeft size={16} /></button>
                    {pageNums.map((n, i) => n === 'gap' ? <span key={`g${i}`} className="muted">…</span> : <button key={n} className={`pager__btn ${n === current ? 'is-active' : ''}`} onClick={() => setPage(n)} aria-current={n === current ? 'page' : undefined}>{n}</button>)}
                    <button className="pager__btn" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Trang sau"><ChevronRight size={16} /></button>
                  </nav>
                </div>
              </>
            )}
        </GlowCard>
      </Rise>

      <Modal open={!!receipt} onClose={() => setReceipt('')} title="Hóa đơn đính kèm" size="lg">
        <div style={{ textAlign: 'center' }}><img src={receipt} alt="Hóa đơn" style={{ maxHeight: '70vh', objectFit: 'contain', borderRadius: 14 }} /></div>
      </Modal>
    </Stage>
  );
}
