import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { AlertTriangle, CloudOff, Inbox, X, type LucideIcon } from 'lucide-react';
import { Glyph, glowColor, nameStyle, storeIcon } from '../lib/icons';
import { moneyNum } from '../lib/format';
import { GlowCard } from './fx';

/* ---------- Số tiền ---------- */
export function Money({ value, sign = false }: { value: number; sign?: boolean }) {
  const prefix = sign ? (value > 0 ? '+' : value < 0 ? '−' : '') : '';
  return <span className="money">{prefix}{moneyNum(Math.abs(value))}<span className="cur">đ</span></span>;
}

/* ---------- Chuyển động dùng chung ---------- */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } };
export const rise: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 170, damping: 22 } },
};
/** Khối con "nổi lên" lần lượt khi trang mở. */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={rise}>{children}</motion.div>;
}
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={stagger} initial="hidden" animate="show">{children}</motion.div>;
}

export function PageHead({ title, desc, actions }: { title: ReactNode; desc?: ReactNode; actions?: ReactNode }) {
  return (
    <Rise className="page-head">
      <div>
        <h2 className="page-head__title">{title}</h2>
        {desc && <p className="page-head__desc">{desc}</p>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </Rise>
  );
}

/* ---------- Danh mục ---------- */
export function Badge({ name, color, icon, size = 'md', hideLabel = false }: { name: string; color?: string | null; icon?: string | null; size?: 'sm' | 'md' | 'lg'; hideLabel?: boolean }) {
  const s = nameStyle(name);
  const c = glowColor(color, s.color);
  const stored = icon ?? storeIcon(s.key);
  const useFallback = !icon || /^(fa|bi)-tag$/.test(icon) || icon === 'lu:tag';
  return (
    <span className="badge">
      <span className={`glyph ${size === 'sm' ? 'glyph--sm' : size === 'lg' ? 'glyph--lg' : ''}`} style={{ ['--c' as string]: c }}>
        <Glyph name={useFallback ? storeIcon(s.key) : stored} size={size === 'sm' ? 15 : 19} />
      </span>
      {!hideLabel && <span className="badge__name">{name}</span>}
    </span>
  );
}

/* ---------- Trạng thái rỗng, lỗi, tải ---------- */
export function Empty({ icon: Icon = Inbox, title, text, action, compact = false, error = false }: { icon?: LucideIcon; title: string; text?: string; action?: ReactNode; compact?: boolean; error?: boolean }) {
  return (
    <div className={`empty ${compact ? 'empty--compact' : ''} ${error ? 'empty--error' : ''}`}>
      <div className="empty__icon"><Icon size={26} strokeWidth={1.8} /></div>
      <p className="empty__title">{title}</p>
      {text && <p className="empty__text">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error?: unknown; onRetry?: () => void }) {
  return (
    <Empty error icon={CloudOff} title="Không tải được dữ liệu"
      text={error instanceof Error ? error.message : 'Kiểm tra kết nối tới máy chủ rồi thử lại.'}
      action={onRetry && <button className="btn btn--sm" onClick={onRetry}>Thử lại</button>} />
  );
}

export function Skeleton({ w = '100%', h = 14, r = 8, className = '' }: { w?: string | number; h?: number; r?: number; className?: string }) {
  return <span className={`skeleton ${className}`} style={{ width: w, height: h, borderRadius: r }} />;
}
export function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <div style={{ padding: '8px 22px' }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="row" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <Skeleton w={40} h={40} r={14} />
          <div className="grow"><Skeleton w="42%" className="mb-1" /><Skeleton w="26%" h={12} /></div>
          <Skeleton w={90} />
        </div>
      ))}
    </div>
  );
}

/* ---------- Số liệu ---------- */
export function Delta({ current, previous, inverse = false }: { current: number; previous?: number | null; inverse?: boolean }) {
  if (!previous) return null;
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (!isFinite(pct)) return null;
  if (Math.abs(pct) < 0.05) return <span className="delta delta--flat">0%</span>;
  const up = pct > 0;
  const good = inverse ? !up : up;
  return <span className={`delta ${good ? 'delta--good' : 'delta--bad'}`}>{up ? '↑' : '↓'} {Math.abs(pct).toFixed(1).replace('.', ',')}%</span>;
}

export function StatCard({ icon: Icon, tone, label, value, foot, spark }: {
  icon: LucideIcon; tone: 'income' | 'expense' | 'blue' | 'warn'; label: string; value: ReactNode; foot?: ReactNode; spark?: ReactNode;
}) {
  return (
    <GlowCard className="stat" tilt>
      <div className="stat__top"><span className={`stat__icon stat__icon--${tone}`}><Icon size={19} strokeWidth={1.9} /></span><span className="stat__label">{label}</span></div>
      <p className="stat__value">{value}</p>
      <div className="stat__foot">{foot}</div>
      {spark && <div className="stat__spark">{spark}</div>}
    </GlowCard>
  );
}
export function StatSkeleton() {
  return (
    <div className="card stat">
      <div className="stat__top"><Skeleton w={40} h={40} r={14} /><Skeleton w={100} /></div>
      <Skeleton w="70%" h={32} />
      <div className="stat__foot"><Skeleton w="50%" /></div>
    </div>
  );
}

/* ---------- Ngân sách ---------- */
export interface BudgetState { key: 'ok' | 'warn' | 'critical' | 'over'; pill: string; text: string }
export function budgetState(pct: number): BudgetState {
  if (pct >= 100) return { key: 'over', pill: 'pill--expense', text: 'Vượt ngân sách' };
  if (pct >= 90) return { key: 'critical', pill: 'pill--warn', text: 'Sắp hết ngân sách' };
  if (pct >= 80) return { key: 'warn', pill: 'pill--warn', text: 'Đã dùng 80%' };
  return { key: 'ok', pill: 'pill', text: '' };
}

export function Bar({ pct, state }: { pct: number; state: BudgetState['key'] }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div className={`bar__fill ${state === 'over' ? 'bar__fill--over' : state === 'ok' ? '' : 'bar__fill--warn'}`}
        initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} />
    </div>
  );
}

export function Ring({ pct, state }: { pct: number; state: BudgetState['key'] }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const id = useId().replace(/:/g, '');
  const stops = state === 'over' ? ['#F43F5E', '#FDA4AF'] : state === 'ok' ? ['#5B8CFF', '#9B7BFF'] : ['#F59E0B', '#FCD34D'];
  return (
    <div className="ring" role="img" aria-label={`Đã dùng ${Math.round(pct)}%`}>
      <svg viewBox="0 0 92 92">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={stops[0]} /><stop offset="100%" stopColor={stops[1]} /></linearGradient>
        </defs>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="9" />
        <motion.circle cx="46" cy="46" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round" strokeDasharray={c}
          style={{ filter: `drop-shadow(0 0 6px ${stops[0]}aa)` }} transform="rotate(-90 46 46)"
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(pct, 100) / 100) }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
      </svg>
      <span>{Math.round(pct)}%</span>
    </div>
  );
}

/* ---------- Form ---------- */
export function Field({ label, error, hint, children }: { label: ReactNode; error?: string; hint?: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      {children(id)}
      {error ? <span className="field__error" role="alert">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}
export const Input = ({ invalid, className = '', ...p }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => <input {...p} className={`input ${invalid ? 'input--invalid' : ''} ${className}`} />;
export const Select = ({ invalid, className = '', ...p }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) => <select {...p} className={`select ${invalid ? 'select--invalid' : ''} ${className}`} />;
export const Textarea = ({ className = '', ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={`textarea ${className}`} />;

export function Segmented<T extends string>({ value, options, onChange, layoutId, tone, block = false }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; layoutId: string; tone?: string; block?: boolean;
}) {
  return (
    <div className={`seg ${block ? 'seg--block' : ''} ${tone ? `seg--${tone}` : ''}`} role="group">
      {options.map(o => (
        <button key={o.value} type="button" className={`seg__btn ${value === o.value ? 'is-active' : ''}`} onClick={() => onChange(o.value)}>
          {value === o.value && <motion.span layoutId={layoutId} className="seg__pill" transition={{ type: 'spring', stiffness: 520, damping: 38 }} />}
          <span className="seg__label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Spinner() { return <span className="spinner" aria-hidden />; }

/* ---------- Hộp thoại (Radix Dialog + chuyển động lò xo) ---------- */
export function Modal({ open = true, onClose, title, children, footer, size = 'md' }: {
  open?: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Dialog.Root open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount><motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></Dialog.Overlay>
            <div className="dialog-wrap">
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div className={`surface dialog ${size === 'sm' ? 'dialog--sm' : size === 'lg' ? 'dialog--lg' : ''}`}
                  initial={{ opacity: 0, y: 28, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}>
                  <div className="dialog__head">
                    <Dialog.Title className="dialog__title">{title}</Dialog.Title>
                    <Dialog.Close asChild><button className="btn btn--ghost btn--icon btn--sm" aria-label="Đóng"><X size={18} /></button></Dialog.Close>
                  </div>
                  {children}
                  {footer && <div className="dialog__foot">{footer}</div>}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export const WarnIcon = AlertTriangle;
