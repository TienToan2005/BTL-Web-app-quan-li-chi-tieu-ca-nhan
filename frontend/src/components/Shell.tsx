import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, BellOff, ChartPie, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, LayoutDashboard,
  LogOut, Plus, Search, Settings as SettingsIcon, ShieldCheck, Tags, UserCog, Wallet, ChartColumn, type LucideIcon,
} from 'lucide-react';
import { useAuth, useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { usePeriod } from '../context/PeriodContext';
import { useBudgets } from '../hooks/queries';
import { money, periodLabel } from '../lib/format';
import { Aurora } from './fx';
import { budgetState, Empty, Skeleton } from './ui';
import { TxModalsProvider, useTxModals } from './TransactionModals';

interface NavItem { key: string; label: string; icon: LucideIcon; to: string }
const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, to: '/dashboard' },
  { key: 'tx-all', label: 'Giao dịch', icon: ArrowLeftRight, to: '/transactions' },
  { key: 'tx-income', label: 'Khoản thu', icon: ArrowDownLeft, to: '/transactions?type=income' },
  { key: 'tx-expense', label: 'Khoản chi', icon: ArrowUpRight, to: '/transactions?type=expense' },
  { key: 'category', label: 'Danh mục', icon: Tags, to: '/settings/category' },
  { key: 'budgets', label: 'Ngân sách', icon: ChartPie, to: '/budgets' },
  { key: 'reports', label: 'Báo cáo thống kê', icon: ChartColumn, to: '/reports' },
  { key: 'wallet', label: 'Ví và tài khoản', icon: Wallet, to: '/settings/wallet' },
];
const SETTINGS: NavItem = { key: 'account', label: 'Cài đặt', icon: SettingsIcon, to: '/settings/account' };

const TITLES: Record<string, { title: string; period?: boolean; add?: boolean }> = {
  '/dashboard': { title: 'Tổng quan', period: true },
  '/transactions': { title: 'Giao dịch', add: false },
  '/budgets': { title: 'Ngân sách', period: true },
  '/reports': { title: 'Báo cáo thống kê', period: true },
  '/settings': { title: 'Cài đặt' },
  '/admin': { title: 'Quản trị hệ thống' },
};

function activeKey(pathname: string, search: string): string {
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/budgets')) return 'budgets';
  if (pathname.startsWith('/reports')) return 'reports';
  if (pathname.startsWith('/transactions')) {
    const t = new URLSearchParams(search).get('type');
    return t === 'income' ? 'tx-income' : t === 'expense' ? 'tx-expense' : 'tx-all';
  }
  if (pathname.startsWith('/settings')) {
    const tab = pathname.split('/')[2];
    return tab === 'wallet' || tab === 'account' ? tab : 'category';
  }
  return '';
}

function DockItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link to={item.to} className={`dock__item ${active ? 'is-active' : ''}`} aria-label={item.label} aria-current={active ? 'page' : undefined}>
      {active && <motion.span layoutId="dock-glow" className="dock__glow" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
      <item.icon size={21} strokeWidth={1.9} />
      <span className="dock__tip" role="tooltip">{item.label}</span>
    </Link>
  );
}

/* ---------- Chọn kỳ ---------- */
function PeriodPicker() {
  const { period, setPeriod, shift } = usePeriod();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(period.year);
  const now = new Date();
  useEffect(() => setYear(period.year), [period.year]);
  return (
    <div className="period" role="group" aria-label="Chọn kỳ báo cáo">
      <button className="period__step" onClick={() => shift(-1)} aria-label="Tháng trước"><ChevronLeft size={18} /></button>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild><button className="period__label">{periodLabel(period)}<ChevronDown size={14} className="muted" /></button></Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="surface popover" sideOffset={10} align="center">
            <div className="row between">
              <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setYear(y => y - 1)} aria-label="Năm trước"><ChevronLeft size={16} /></button>
              <strong style={{ fontFamily: 'var(--display)' }}>{year}</strong>
              <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setYear(y => y + 1)} aria-label="Năm sau"><ChevronRight size={16} /></button>
            </div>
            <div className="months">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <button key={m} onClick={() => { setPeriod(m, year); setOpen(false); }}
                  className={`months__btn ${m === period.month && year === period.year ? 'is-active' : ''} ${m === now.getMonth() + 1 && year === now.getFullYear() ? 'is-now' : ''}`}>T{m}</button>
              ))}
            </div>
            <button className="btn btn--sm btn--block mt-1" onClick={() => { setPeriod(now.getMonth() + 1, now.getFullYear()); setOpen(false); }}>Về tháng hiện tại</button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <button className="period__step" onClick={() => shift(1)} aria-label="Tháng sau"><ChevronRight size={18} /></button>
    </div>
  );
}

/* ---------- Thông báo: ngân sách đã dùng từ 80% ---------- */
function Notifications() {
  const now = new Date();
  const q = useBudgets({ month: now.getMonth() + 1, year: now.getFullYear() });
  const alerts = (q.data ?? []).map(b => ({ ...b, pct: b.amount_limit > 0 ? (b.actual_spent / b.amount_limit) * 100 : 0 })).filter(b => b.pct >= 80).sort((a, b) => b.pct - a.pct);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="btn btn--ghost btn--icon bell" aria-label="Thông báo"><Bell size={19} />{alerts.length > 0 && <span className="bell__dot">{alerts.length}</span>}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="surface notif" sideOffset={10} align="end">
          <div className="notif__head">Thông báo</div>
          {q.isLoading && <div style={{ padding: 16 }}><Skeleton className="mb-1" /><Skeleton w="65%" /></div>}
          {q.isSuccess && alerts.length === 0 && <Empty compact icon={BellOff} title="Chưa có cảnh báo" text="Ngân sách của bạn vẫn trong tầm kiểm soát." />}
          {alerts.map(b => {
            const st = budgetState(b.pct);
            return (
              <Link key={b.id} to="/budgets" className="notif__item">
                <span className={`stat__icon ${b.pct >= 100 ? 'stat__icon--expense' : 'stat__icon--warn'}`}><ChartPie size={18} /></span>
                <span><span style={{ display: 'block', fontWeight: 500 }}>{b.category_name}: {st.text.toLowerCase()}</span>
                  <span className="muted fs-13">{money(b.actual_spent)} / {money(b.amount_limit)} ({Math.round(b.pct)}%)</span></span>
              </Link>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ---------- Lệnh nhanh (Ctrl/Cmd + K) ---------- */
interface Cmd { id: string; label: string; group: string; icon: LucideIcon; run: () => void; hint?: string }
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();

function CommandPalette({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => void }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const { openAdd, openTransfer } = useTxModals();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const go = (to: string) => () => nav(to);
    const list: Cmd[] = [
      { id: 'add-exp', group: 'Hành động', label: 'Thêm khoản chi', icon: ArrowUpRight, run: () => openAdd('EXPENSE') },
      { id: 'add-inc', group: 'Hành động', label: 'Thêm khoản thu', icon: ArrowDownLeft, run: () => openAdd('INCOME') },
      { id: 'transfer', group: 'Hành động', label: 'Chuyển tiền giữa các ví', icon: CircleDollarSign, run: openTransfer },
      ...[...NAV, SETTINGS].map(n => ({ id: n.key, group: 'Đi tới', label: n.label, icon: n.icon, run: go(n.to) })),
    ];
    if (user?.role === 'ADMIN') list.push({ id: 'admin', group: 'Đi tới', label: 'Quản trị hệ thống', icon: ShieldCheck, run: go('/admin') });
    list.push({ id: 'logout', group: 'Tài khoản', label: 'Đăng xuất', icon: LogOut, run: onLogout });
    return list;
  }, [nav, openAdd, openTransfer, onLogout, user?.role]);

  const results = useMemo(() => { const t = fold(q.trim()); return t ? commands.filter(c => fold(c.label).includes(t)) : commands; }, [commands, q]);
  useEffect(() => { setIdx(0); }, [q, open]);
  useEffect(() => { if (!open) setQ(''); }, [open]);
  useEffect(() => { listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }); }, [idx]);

  const run = (c?: Cmd) => { if (!c) return; onClose(); window.setTimeout(c.run, 60); };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[idx]); }
  };

  let lastGroup = '';
  return (
    <Dialog.Root open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount><motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <div className="cmdk-wrap">
              <motion.div className="surface cmdk" initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
                <Dialog.Title className="visually-hidden">Tìm và chạy lệnh</Dialog.Title>
                <div style={{ position: 'relative' }}>
                  <Search className="cmdk__icon" size={20} />
                  <input className="cmdk__input" autoFocus placeholder="Gõ để tìm trang hoặc hành động..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={key} aria-label="Tìm lệnh" />
                </div>
                <div className="cmdk__list" ref={listRef}>
                  {results.length === 0 && <Empty compact title="Không có lệnh phù hợp" text="Thử từ khóa khác, ví dụ “ngân sách” hoặc “thêm”." />}
                  {results.map((c, i) => {
                    const head = c.group !== lastGroup ? <div className="cmdk__group" key={`g-${c.group}`}>{c.group}</div> : null;
                    lastGroup = c.group;
                    return (
                      <div key={c.id}>
                        {head}
                        <button className={`cmdk__item ${i === idx ? 'is-active' : ''}`} data-active={i === idx} onMouseMove={() => setIdx(i)} onClick={() => run(c)}>
                          <c.icon size={18} />{c.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="cmdk__foot"><span>↑↓ để chọn</span><span>Enter để chạy</span><span>Esc để đóng</span></div>
              </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Frame() {
  const user = useUser();
  const { logout } = useAuth();
  const { confirm } = useFeedback();
  const { openAdd } = useTxModals();
  const loc = useLocation();
  const nav = useNavigate();
  const [palette, setPalette] = useState(false);

  const base = '/' + loc.pathname.split('/')[1];
  const meta = TITLES[base] ?? { title: '' };
  const active = activeKey(loc.pathname, loc.search);
  const initial = (user.username.trim().charAt(0) || 'U').toUpperCase();
  const roleText = user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng';

  useEffect(() => { document.title = `${meta.title} - Zero-G Budget`; }, [meta.title]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(p => !p); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const doLogout = async () => {
    const ok = await confirm({ title: 'Đăng xuất?', text: 'Bạn sẽ cần đăng nhập lại để tiếp tục.', confirmText: 'Đăng xuất' });
    if (ok) { logout(); nav('/login'); }
  };

  return (
    <div className="shell">
      <Aurora />
      <nav className="dock" aria-label="Điều hướng chính">
        <Link to="/dashboard" className="dock__brand" aria-label="Zero-G Budget"><CircleDollarSign size={24} /></Link>
        <div className="dock__nav">
          {NAV.map(n => <DockItem key={n.key} item={n} active={active === n.key} />)}
          <div className="dock__sep" />
          <DockItem item={SETTINGS} active={active === 'account'} />
        </div>
      </nav>

      <div className="main">
        <header className="topbar">
          <h1 className="topbar__title">{meta.title}</h1>
          <span className="topbar__spacer" />
          <button className="cmdk-trigger" onClick={() => setPalette(true)} aria-label="Mở lệnh nhanh"><Search size={16} /><span>Tìm hoặc chạy lệnh</span></button>
          {meta.period && <div className="period-slot-desktop"><PeriodPicker /></div>}
          {meta.add !== false && <button className="btn btn--primary" onClick={() => openAdd()}><Plus size={18} /><span className="hide-m">Thêm giao dịch</span></button>}
          <Notifications />
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <button className="avatar-btn" aria-label="Menu tài khoản"><span className="avatar">{initial}</span><span className="name fs-13" style={{ fontWeight: 500 }}>{user.username}</span><ChevronDown size={14} className="chev muted" /></button>
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content className="surface menu" sideOffset={10} align="end">
                <div className="menu__head"><div style={{ fontWeight: 600 }}>{user.username}</div><div className="muted fs-12">{roleText}</div></div>
                <div className="menu__sep" />
                <Dropdown.Item className="menu__item" onSelect={() => nav('/settings/account')}><UserCog size={17} />Tài khoản và cài đặt</Dropdown.Item>
                <Dropdown.Item className="menu__item show-m" onSelect={() => nav('/transactions?type=income')}><ArrowDownLeft size={17} />Khoản thu</Dropdown.Item>
                <Dropdown.Item className="menu__item show-m" onSelect={() => nav('/transactions?type=expense')}><ArrowUpRight size={17} />Khoản chi</Dropdown.Item>
                <Dropdown.Item className="menu__item show-m" onSelect={() => nav('/settings/category')}><Tags size={17} />Danh mục</Dropdown.Item>
                <Dropdown.Item className="menu__item show-m" onSelect={() => nav('/settings/wallet')}><Wallet size={17} />Ví và tài khoản</Dropdown.Item>
                {user.role === 'ADMIN' && <Dropdown.Item className="menu__item" onSelect={() => nav('/admin')}><ShieldCheck size={17} />Quản trị hệ thống</Dropdown.Item>}
                <div className="menu__sep" />
                <Dropdown.Item className="menu__item menu__item--danger" onSelect={doLogout}><LogOut size={17} />Đăng xuất</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        </header>
        {meta.period && <div className="period-slot-mobile" style={{ marginTop: 14 }}><PeriodPicker /></div>}
        <main className="page"><Outlet /></main>
      </div>

      <nav className="dock-m" aria-label="Điều hướng nhanh">
        {[NAV[0], NAV[1]].map(n => <Link key={n.key} to={n.to} className={`dock-m__item ${active === n.key ? 'is-active' : ''}`} aria-label={n.label}><n.icon size={22} /></Link>)}
        <button className="dock-m__add" onClick={() => openAdd()} aria-label="Thêm giao dịch"><Plus size={26} /></button>
        {[NAV[5], NAV[6]].map(n => <Link key={n.key} to={n.to} className={`dock-m__item ${active === n.key ? 'is-active' : ''}`} aria-label={n.label}><n.icon size={22} /></Link>)}
      </nav>

      <CommandPalette open={palette} onClose={() => setPalette(false)} onLogout={doLogout} />
    </div>
  );
}

export function Shell(): ReactNode {
  return <TxModalsProvider><Frame /></TxModalsProvider>;
}
