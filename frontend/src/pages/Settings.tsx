import { useState, type FormEvent } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, LogOut, Plus, ShieldCheck, Tags, Trash2, User as UserIcon, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import { CATEGORY_ICON_KEYS, Glyph, ICONS, glowColor, nameStyle, storeIcon, WALLET_ICON_KEYS } from '../lib/icons';
import { formatMoneyInput, money, parseMoneyInput } from '../lib/format';
import { useAuth, useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { useCategories, useRefreshMoney, useWallets } from '../hooks/queries';
import { GlowCard } from '../components/fx';
import { Badge, Empty, ErrorState, Field, Input, PageHead, Rise, Segmented, SkeletonRows, Spinner, Stage } from '../components/ui';
import type { CategoryType } from '../types';

type Tab = 'category' | 'wallet' | 'account';
const TABS: { key: Tab; label: string; icon: typeof Tags; lead: string; desc: string }[] = [
  { key: 'category', label: 'Danh mục', icon: Tags, lead: 'Danh mục', desc: 'Tạo và quản lý danh mục thu chi của bạn.' },
  { key: 'wallet', label: 'Ví và tài khoản', icon: Wallet, lead: 'Ví và tài khoản', desc: 'Theo dõi số dư của từng ví, tài khoản ngân hàng hay tiền mặt.' },
  { key: 'account', label: 'Tài khoản đăng nhập', icon: UserIcon, lead: 'Tài khoản đăng nhập', desc: 'Thông tin tài khoản bạn đang sử dụng.' },
];

function IconPicker({ keys, value, onChange, label }: { keys: string[]; value: string; onChange: (k: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[value] ?? ICONS.tag;
  return (
    <Field label={label}>
      {id => (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild><button id={id} type="button" className="input select-like"><span className="row" style={{ gap: 10 }}><Icon size={18} />Chọn</span><ChevronDown size={16} className="muted" /></button></Popover.Trigger>
          <Popover.Portal><Popover.Content className="surface" sideOffset={8} style={{ zIndex: 95 }}>
            <div className="icon-grid">
              {keys.map(k => { const I = ICONS[k]; return <button key={k} type="button" className={k === value ? 'is-active' : ''} aria-label={k} onClick={() => { onChange(k); setOpen(false); }}><I size={19} /></button>; })}
            </div>
          </Popover.Content></Popover.Portal>
        </Popover.Root>
      )}
    </Field>
  );
}

function CategoriesTab() {
  const user = useUser();
  const { toast, confirm } = useFeedback();
  const refresh = useRefreshMoney();
  const q = useCategories();
  const [type, setType] = useState<Exclude<CategoryType, 'TRANSFER'>>('EXPENSE');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState('#5B8CFF');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onName = (v: string) => { setName(v); setError(''); const s = nameStyle(v.trim()); if (s.key !== 'tag') { setIcon(s.key); setColor(s.color); } };

  async function create(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) { setError('Nhập tên danh mục.'); return; }
    setBusy(true);
    try {
      await api.createCategory({ user_id: user.id, name: n, type, icon: storeIcon(icon), color });
      setName(''); setIcon('tag'); await refresh();
      toast('success', `Đã tạo danh mục "${n}".`, 'Đã tạo danh mục');
    } catch (err) { setError(err instanceof Error ? err.message : 'Không tạo được danh mục.'); }
    finally { setBusy(false); }
  }
  async function remove(id: number, n: string) {
    if (!await confirm({ title: `Xóa danh mục "${n}"?`, text: 'Danh mục đang có giao dịch sẽ không xóa được.', confirmText: 'Xóa danh mục', danger: true })) return;
    try { await api.deleteCategory(id, user.id); await refresh(); toast('success', `Đã xóa danh mục "${n}".`, 'Đã xóa'); }
    catch (err) { toast('error', err instanceof Error ? err.message : 'Không xóa được danh mục.'); }
  }

  const list = (q.data ?? []).filter(c => c.name !== 'Chuyển khoản');
  const group = (title: string, items: typeof list) => items.length === 0 ? null : (
    <div className="mb-3" key={title}>
      <h4 className="group-title">{title} · {items.length}</h4>
      <div style={{ border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
        {items.map(c => (
          <motion.div layout className="list-row" key={c.id}>
            <Badge name={c.name} color={c.color} icon={c.icon} hideLabel />
            <div className="grow"><div className="truncate" style={{ fontWeight: 500 }}>{c.name}</div><div className="fs-13 muted">{(c.transaction_count ?? 0).toLocaleString('vi-VN')} giao dịch</div></div>
            {c.user_id == null ? <span className="pill">Mặc định</span>
              : <button className="btn btn--ghost btn--danger btn--icon btn--sm" onClick={() => remove(c.id, c.name)} aria-label={`Xóa danh mục ${c.name}`} title="Xóa danh mục"><Trash2 size={16} /></button>}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid g-form">
      <GlowCard>
        <form onSubmit={create} noValidate className="grid" style={{ gap: 16 }}>
          <h3 className="card__title">Thêm danh mục</h3>
          <Segmented block tone={type === 'INCOME' ? 'income' : 'expense'} layoutId="cat-type" value={type} onChange={setType} options={[{ value: 'EXPENSE', label: 'Chi tiêu' }, { value: 'INCOME', label: 'Thu nhập' }]} />
          <Field label="Tên danh mục" error={error}>{id => <Input id={id} placeholder="Ví dụ: Ăn sáng" maxLength={50} autoComplete="off" invalid={!!error} value={name} onChange={e => onName(e.target.value)} />}</Field>
          <div className="grid g-2" style={{ gap: 14 }}>
            <IconPicker label="Biểu tượng" keys={CATEGORY_ICON_KEYS} value={icon} onChange={setIcon} />
            <Field label="Màu">{id => <Input id={id} type="color" value={color} onChange={e => setColor(e.target.value)} />}</Field>
          </div>
          <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? <Spinner /> : <Plus size={17} />}Tạo danh mục</button>
        </form>
      </GlowCard>
      <GlowCard>
        {q.isLoading ? <SkeletonRows n={5} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} />
          : list.length === 0 ? <Empty icon={Tags} title="Chưa có danh mục nào" text="Tạo danh mục đầu tiên ở khung bên cạnh." />
          : <>{group('Chi tiêu', list.filter(c => c.type === 'EXPENSE'))}{group('Thu nhập', list.filter(c => c.type === 'INCOME'))}</>}
      </GlowCard>
    </div>
  );
}

function WalletsTab() {
  const user = useUser();
  const { toast } = useFeedback();
  const refresh = useRefreshMoney();
  const q = useWallets();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState('#5B8CFF');
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});
  const [busy, setBusy] = useState(false);

  async function create(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Nhập tên ví.';
    if (balance.trim() === '') next.balance = 'Nhập số dư ban đầu (có thể là 0).';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.createWallet({ user_id: user.id, name: name.trim(), balance: parseMoneyInput(balance), icon: storeIcon(icon), color });
      setName(''); setBalance(''); setIcon('wallet'); await refresh();
      toast('success', 'Ví mới đã sẵn sàng để dùng.', 'Đã thêm ví');
    } catch (err) { toast('error', err instanceof Error ? err.message : 'Không thêm được ví.'); }
    finally { setBusy(false); }
  }
  const list = q.data ?? [];
  const total = list.reduce((s, w) => s + w.balance, 0);

  return (
    <div className="grid g-form">
      <GlowCard>
        <form onSubmit={create} noValidate className="grid" style={{ gap: 16 }}>
          <h3 className="card__title">Thêm ví</h3>
          <Field label="Tên ví" error={errors.name}>{id => <Input id={id} placeholder="Ví dụ: Tiền mặt, Techcombank" maxLength={50} autoComplete="off" invalid={!!errors.name} value={name} onChange={e => { setName(e.target.value); setErrors(x => ({ ...x, name: undefined })); }} />}</Field>
          <Field label="Số dư ban đầu" error={errors.balance}>{id => <div className="money-input"><Input id={id} inputMode="numeric" placeholder="0" autoComplete="off" invalid={!!errors.balance} value={balance} style={{ fontSize: 22, minHeight: 56 }} onChange={e => { setBalance(formatMoneyInput(e.target.value)); setErrors(x => ({ ...x, balance: undefined })); }} /></div>}</Field>
          <div className="grid g-2" style={{ gap: 14 }}>
            <IconPicker label="Biểu tượng" keys={WALLET_ICON_KEYS} value={icon} onChange={setIcon} />
            <Field label="Màu">{id => <Input id={id} type="color" value={color} onChange={e => setColor(e.target.value)} />}</Field>
          </div>
          <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? <Spinner /> : <Plus size={17} />}Thêm ví</button>
        </form>
      </GlowCard>
      <GlowCard>
        {q.isLoading ? <SkeletonRows n={3} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} />
          : list.length === 0 ? <Empty icon={Wallet} title="Chưa có ví nào" text="Thêm ví đầu tiên để bắt đầu ghi giao dịch." /> : (
            <>
              <div className="row between mb-2"><h3 className="card__title">Ví của bạn · {list.length}</h3><div style={{ textAlign: 'right' }}><div className="fs-13 muted">Tổng số dư</div><div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600 }}>{money(total)}</div></div></div>
              <div style={{ border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
                {list.map(w => (
                  <motion.div layout className="list-row" key={w.id}>
                    <span className="glyph" style={{ ['--c' as string]: glowColor(w.color, '#5B8CFF') }}><Glyph name={w.icon} size={19} /></span>
                    <div className="grow truncate" style={{ fontWeight: 500 }}>{w.name}</div>
                    <div className={`amount ${w.balance < 0 ? 'amount--expense' : ''}`}>{money(w.balance)}</div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
      </GlowCard>
    </div>
  );
}

function AccountTab() {
  const user = useUser();
  const { logout } = useAuth();
  const { confirm } = useFeedback();
  const nav = useNavigate();
  return (
    <GlowCard style={{ maxWidth: 560 }}>
      <div className="row mb-3" style={{ gap: 16 }}>
        <span className="avatar" style={{ width: 60, height: 60, fontSize: 24 }}>{(user.username.charAt(0) || 'U').toUpperCase()}</span>
        <div><div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600 }}>{user.username}</div><div className="muted fs-13">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</div></div>
      </div>
      <div className="row wrap">
        {user.role === 'ADMIN' && <button className="btn" onClick={() => nav('/admin')}><ShieldCheck size={16} />Quản trị hệ thống</button>}
        <button className="btn btn--danger" onClick={async () => { if (await confirm({ title: 'Đăng xuất?', text: 'Bạn sẽ cần đăng nhập lại để tiếp tục.', confirmText: 'Đăng xuất' })) { logout(); nav('/login'); } }}><LogOut size={16} />Đăng xuất</button>
      </div>
    </GlowCard>
  );
}

export default function Settings() {
  const { tab } = useParams();
  const nav = useNavigate();
  const current = TABS.find(t => t.key === tab);
  if (!current) return <Navigate to="/settings/category" replace />;
  return (
    <Stage>
      <PageHead title={current.lead} desc={current.desc} />
      <Rise>
        <div className="tabs" role="tablist">
          {TABS.map(t => (
            <button key={t.key} role="tab" aria-selected={t.key === current.key} className={`tabs__btn ${t.key === current.key ? 'is-active' : ''}`} onClick={() => nav(`/settings/${t.key}`)}>
              <t.icon size={17} />{t.label}{t.key === current.key && <motion.span layoutId="settings-tab" className="tabs__line" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            </button>
          ))}
        </div>
      </Rise>
      <motion.div key={current.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {current.key === 'category' && <CategoriesTab />}
        {current.key === 'wallet' && <WalletsTab />}
        {current.key === 'account' && <AccountTab />}
      </motion.div>
    </Stage>
  );
}
