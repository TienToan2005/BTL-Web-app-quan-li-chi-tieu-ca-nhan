import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { formatMoneyInput, money, pad, parseMoneyInput, toYmd } from '../lib/format';
import { useCategories, useRefreshMoney, useWallets } from '../hooks/queries';
import { useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { Field, Input, Modal, Segmented, Select, Spinner, Textarea } from './ui';

/** Form thêm giao dịch và chuyển tiền, mở được từ mọi trang (và từ lệnh nhanh Ctrl+K). */
interface Value { openAdd: (type?: 'INCOME' | 'EXPENSE') => void; openTransfer: () => void }
const Ctx = createContext<Value | null>(null);
export function useTxModals(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTxModals phải nằm trong TxModalsProvider');
  return v;
}

export function TxModalsProvider({ children }: { children: ReactNode }) {
  const [add, setAdd] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const [transfer, setTransfer] = useState(false);
  const value = useMemo<Value>(() => ({ openAdd: (t = 'EXPENSE') => setAdd(t), openTransfer: () => setTransfer(true) }), []);
  return (
    <Ctx.Provider value={value}>
      {children}
      {add && <AddModal initialType={add} onClose={() => setAdd(null)} />}
      {transfer && <TransferModal onClose={() => setTransfer(false)} />}
    </Ctx.Provider>
  );
}

const ErrorLine = ({ message }: { message: string }) => <div className="banner banner--error mt-2" role="alert"><AlertCircle size={18} /><span>{message}</span></div>;

function MoneyField({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <Field label={label} error={error}>
      {id => <div className="money-input"><Input id={id} inputMode="numeric" placeholder="0" autoComplete="off" autoFocus invalid={!!error} value={value} onChange={e => onChange(formatMoneyInput(e.target.value))} /></div>}
    </Field>
  );
}

function AddModal({ initialType, onClose }: { initialType: 'INCOME' | 'EXPENSE'; onClose: () => void }) {
  const user = useUser();
  const nav = useNavigate();
  const { toast } = useFeedback();
  const refresh = useRefreshMoney();
  const wallets = useWallets();
  const categories = useCategories();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [date, setDate] = useState(toYmd(new Date()));
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  const list = wallets.data ?? [];
  useEffect(() => { if (list.length === 1 && !walletId) setWalletId(String(list[0].id)); }, [list, walletId]);
  useEffect(() => {
    if (wallets.isSuccess && wallets.data.length === 0) {
      toast('warning', 'Bạn cần tạo ít nhất một ví trước khi thêm giao dịch.');
      onClose();
      nav('/settings/wallet');
    }
  }, [wallets.isSuccess, wallets.data, toast, onClose, nav]);

  const cats = (categories.data ?? []).filter(c => c.type === type && c.name !== 'Chuyển khoản');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const raw = parseMoneyInput(amount);
    if (raw <= 0) next.amount = 'Nhập số tiền lớn hơn 0.';
    if (!categoryId) next.category = 'Chọn danh mục.';
    if (!walletId) next.wallet = 'Chọn ví.';
    if (!date) next.date = 'Chọn ngày giao dịch.';
    if (file && !file.type.startsWith('image/')) next.file = 'Chỉ chọn tệp hình ảnh.';
    setErrors(next); setSubmitError('');
    if (Object.keys(next).length) return;
    const now = new Date();
    setBusy(true);
    try {
      const res = await api.createTransaction({
        user_id: user.id, wallet_id: Number(walletId), category_id: Number(categoryId), amount: raw, note: note.trim(),
        transaction_date: `${date}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      });
      const txId = res?.id ?? res?.data?.id;
      let receiptFailed = false;
      if (txId && file) { try { await api.uploadReceipt(txId, file); } catch { receiptFailed = true; } }
      await refresh();
      onClose();
      if (receiptFailed) toast('warning', 'Giao dịch đã lưu nhưng không tải được hóa đơn lên.');
      else toast('success', type === 'INCOME' ? 'Đã lưu khoản thu.' : 'Đã lưu khoản chi.', 'Đã lưu giao dịch');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Không lưu được giao dịch.');
    } finally { setBusy(false); }
  }

  return (
    <Modal onClose={onClose} title="Thêm giao dịch"
      footer={<>
        <button className="btn" type="button" onClick={onClose}>Hủy</button>
        <button className="btn btn--primary" type="submit" form="tx-form" disabled={busy}>{busy && <Spinner />}Lưu giao dịch</button>
      </>}>
      <form id="tx-form" onSubmit={submit} noValidate className="grid" style={{ gap: 16 }}>
        <Segmented block tone={type === 'INCOME' ? 'income' : 'expense'} layoutId="tx-type" value={type} onChange={t => { setType(t); setCategoryId(''); }}
          options={[{ value: 'EXPENSE', label: 'Chi tiêu' }, { value: 'INCOME', label: 'Thu nhập' }]} />
        <MoneyField label="Số tiền" value={amount} onChange={setAmount} error={errors.amount} />
        <div className="grid g-2" style={{ gap: 14 }}>
          <Field label="Danh mục" error={errors.category}>{id => (
            <Select id={id} invalid={!!errors.category} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Chọn danh mục</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>)}</Field>
          <Field label="Ví thanh toán" error={errors.wallet}>{id => (
            <Select id={id} invalid={!!errors.wallet} value={walletId} onChange={e => setWalletId(e.target.value)}>
              <option value="">Chọn ví</option>{list.map(w => <option key={w.id} value={w.id}>{w.name} · {money(w.balance)}</option>)}
            </Select>)}</Field>
        </div>
        <Field label="Ngày giao dịch" error={errors.date}>{id => <Input id={id} type="date" invalid={!!errors.date} value={date} onChange={e => setDate(e.target.value)} />}</Field>
        <Field label="Ghi chú">{id => <Textarea id={id} rows={2} maxLength={255} placeholder="Ví dụ: ăn trưa với đồng nghiệp" value={note} onChange={e => setNote(e.target.value)} />}</Field>
        <Field label="Hóa đơn đính kèm (không bắt buộc)" error={errors.file}>{id => <Input id={id} type="file" accept="image/*" invalid={!!errors.file} onChange={e => setFile(e.target.files?.[0] ?? null)} style={{ paddingTop: 10 }} />}</Field>
        {submitError && <ErrorLine message={submitError} />}
      </form>
    </Modal>
  );
}

function TransferModal({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const { toast } = useFeedback();
  const refresh = useRefreshMoney();
  const wallets = useWallets();
  const list = wallets.data ?? [];
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (list.length >= 2 && !from) { setFrom(String(list[0].id)); setTo(String(list[1].id)); }
    if (wallets.isSuccess && list.length < 2) { toast('warning', 'Cần ít nhất hai ví để chuyển tiền.'); onClose(); }
  }, [list, from, wallets.isSuccess, toast, onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const raw = parseMoneyInput(amount);
    if (raw <= 0) next.amount = 'Nhập số tiền lớn hơn 0.';
    if (!from) next.from = 'Chọn ví nguồn.';
    if (!to || to === from) next.to = 'Chọn ví đích khác ví nguồn.';
    setErrors(next); setSubmitError('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.transfer({ from_wallet_id: Number(from), to_wallet_id: Number(to), amount: raw, user_id: user.id });
      await refresh(); onClose();
      toast('success', 'Đã chuyển tiền giữa hai ví.', 'Đã chuyển tiền');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Không chuyển được tiền.');
    } finally { setBusy(false); }
  }

  const opts = list.map(w => <option key={w.id} value={w.id}>{w.name} · {money(w.balance)}</option>);
  return (
    <Modal onClose={onClose} title="Chuyển tiền giữa các ví"
      footer={<>
        <button className="btn" type="button" onClick={onClose}>Hủy</button>
        <button className="btn btn--primary" type="submit" form="transfer-form" disabled={busy}>{busy && <Spinner />}Xác nhận chuyển</button>
      </>}>
      <form id="transfer-form" onSubmit={submit} noValidate className="grid" style={{ gap: 16 }}>
        <MoneyField label="Số tiền chuyển" value={amount} onChange={setAmount} error={errors.amount} />
        <div className="grid g-2" style={{ gap: 14 }}>
          <Field label="Từ ví" error={errors.from}>{id => <Select id={id} invalid={!!errors.from} value={from} onChange={e => setFrom(e.target.value)}>{opts}</Select>}</Field>
          <Field label="Sang ví" error={errors.to}>{id => <Select id={id} invalid={!!errors.to} value={to} onChange={e => setTo(e.target.value)}>{opts}</Select>}</Field>
        </div>
        {submitError && <ErrorLine message={submitError} />}
      </form>
    </Modal>
  );
}
