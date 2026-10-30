import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown, ImageIcon, Paperclip, Trash2 } from 'lucide-react';
import { BASE_URL } from '../lib/api';
import { glowColor, nameStyle, storeIcon, Glyph } from '../lib/icons';
import { dayKey, dayLabel, formatDate, isTransfer, money } from '../lib/format';
import type { Transaction } from '../types';

export type SortKey = 'date' | 'amount';
export interface Sort { key: SortKey; dir: 'asc' | 'desc' }

interface Props {
  items: Transaction[];
  netItems?: Transaction[];
  group?: boolean;
  sort?: Sort;
  onSort?: (key: SortKey) => void;
  onDelete?: (tx: Transaction) => void;
  onReceipt?: (url: string) => void;
  head?: boolean;
}

const receiptUrl = (t: Transaction) => (!t.image_url ? '' : t.image_url.startsWith('http') ? t.image_url : `${BASE_URL}${t.image_url}`);

function view(t: Transaction) {
  const transfer = isTransfer(t);
  const expense = t.category_type === 'EXPENSE';
  const s = nameStyle(t.category_name);
  return {
    transfer,
    title: t.note?.trim() ? t.note.trim() : t.category_name,
    icon: transfer ? 'lu:transfer' : t.category_icon && !/tag$/.test(t.category_icon) ? t.category_icon : storeIcon(s.key),
    color: transfer ? '#7FA2FF' : glowColor(t.category_color, s.color),
    cls: transfer ? 'amount--transfer' : expense ? 'amount--expense' : 'amount--income',
    sign: expense ? '−' : '+',
  };
}

function SortBtn({ label, k, sort, onSort }: { label: string; k: SortKey; sort?: Sort; onSort?: (k: SortKey) => void }) {
  if (!sort || !onSort) return <>{label}</>;
  const on = sort.key === k;
  const Icon = on ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return <button type="button" className={on ? 'is-sorted' : ''} onClick={() => onSort(k)}>{label}<Icon size={13} /></button>;
}

export function TransactionList({ items, netItems = items, group = false, sort, onSort, onDelete, onReceipt, head = true }: Props) {
  const net: Record<string, number> = {};
  if (group) {
    netItems.forEach(t => {
      if (isTransfer(t)) return;
      const k = dayKey(t.transaction_date);
      net[k] = (net[k] ?? 0) + (t.category_type === 'INCOME' ? 1 : -1) * t.amount;
    });
  }
  const dayHead = (i: number) => {
    if (!group) return null;
    const k = dayKey(items[i].transaction_date);
    if (i > 0 && dayKey(items[i - 1].transaction_date) === k) return null;
    const n = net[k] ?? 0;
    return { label: dayLabel(k), net: `${n >= 0 ? '+' : '−'}${money(Math.abs(n))}` };
  };

  return (
    <div className="tx">
      {head && (
        <div className="tx__row tx__head">
          <span>Giao dịch</span><span className="tx__cat">Danh mục</span>
          <span><SortBtn label="Ngày" k="date" sort={sort} onSort={onSort} /></span>
          <span>Ví</span>
          <span style={{ textAlign: 'right' }}><SortBtn label="Số tiền" k="amount" sort={sort} onSort={onSort} /></span>
          {(onDelete || onReceipt) ? <span className="tx__actions" /> : <span />}
        </div>
      )}
      {items.map((t, i) => {
        const v = view(t);
        const h = dayHead(i);
        const url = receiptUrl(t);
        return (
          <Fragment key={t.id}>
            {h && <div className="tx__day"><span>{h.label}</span><span>{h.net}</span></div>}
            <motion.div className="tx__row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.025, type: 'spring', stiffness: 220, damping: 26 }}>
              <div className="tx__main">
                <span className="glyph" style={{ ['--c' as string]: v.color }}><Glyph name={v.icon} size={19} /></span>
                <div style={{ minWidth: 0 }}>
                  <div className="tx__title">{v.title}</div>
                  <div className="tx__sub">{v.transfer ? 'Chuyển giữa các ví' : t.category_name}{t.image_url && !v.transfer && <> · <Paperclip size={12} style={{ verticalAlign: '-2px' }} /> hóa đơn</>}</div>
                </div>
              </div>
              <div className="tx__cat muted truncate">{v.transfer ? 'Chuyển khoản' : t.category_name}</div>
              <div className="muted nowrap fs-13">{formatDate(t.transaction_date)}</div>
              <div className="muted truncate fs-13">{t.wallet_name}</div>
              <div className={`amount tx__amt ${v.cls}`}>{v.sign}{money(t.amount)}<div className="tx__mobile muted fs-12" style={{ fontFamily: 'var(--font)' }}>{formatDate(t.transaction_date)}</div></div>
              {(onDelete || onReceipt) && (
                <div className="tx__actions">
                  {url && onReceipt && <button className="btn btn--ghost btn--icon btn--sm" onClick={() => onReceipt(url)} aria-label="Xem hóa đơn" title="Xem hóa đơn"><ImageIcon size={16} /></button>}
                  {onDelete && <button className="btn btn--ghost btn--danger btn--icon btn--sm" onClick={() => onDelete(t)} aria-label="Xóa giao dịch" title="Xóa giao dịch"><Trash2 size={16} /></button>}
                </div>
              )}
            </motion.div>
          </Fragment>
        );
      })}
    </div>
  );
}
