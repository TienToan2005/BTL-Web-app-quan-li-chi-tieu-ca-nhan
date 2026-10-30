import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, Trash2, XCircle, X, type LucideIcon } from 'lucide-react';
import { Modal } from '../components/ui';

type ToastKind = 'success' | 'error' | 'info' | 'warning';
interface ToastItem { id: number; kind: ToastKind; message: string; title?: string }
interface ConfirmOptions { title: string; text?: string; confirmText?: string; danger?: boolean; icon?: LucideIcon }

interface FeedbackValue {
  toast: (kind: ToastKind, message: string, title?: string) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<FeedbackValue | null>(null);
const ICON: Record<ToastKind, LucideIcon> = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle };

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => setToasts(l => l.filter(t => t.id !== id)), []);
  const toast = useCallback((kind: ToastKind, message: string, title?: string) => {
    const id = ++seq.current;
    setToasts(l => [...l.slice(-3), { id, kind, message, title }]);
    window.setTimeout(() => dismiss(id), kind === 'error' ? 6500 : 3800);
  }, [dismiss]);
  const confirm = useCallback((opts: ConfirmOptions) => new Promise<boolean>(resolve => setDialog({ ...opts, resolve })), []);
  const close = (v: boolean) => { dialog?.resolve(v); setDialog(null); };
  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);
  const DialogIcon = dialog?.icon ?? (dialog?.danger ? Trash2 : AlertTriangle);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map(t => {
            const Icon = ICON[t.kind];
            return (
              <motion.div key={t.id} layout role={t.kind === 'error' ? 'alert' : 'status'} className={`surface toast toast--${t.kind}`}
                initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
                <Icon className="toast__icon" size={20} />
                <div className="grow">
                  {t.title && <div style={{ fontWeight: 600 }}>{t.title}</div>}
                  <div className={t.title ? 'muted fs-13' : ''}>{t.message}</div>
                </div>
                <button className="btn btn--ghost btn--icon btn--sm" aria-label="Đóng" onClick={() => dismiss(t.id)}><X size={16} /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal open={!!dialog} onClose={() => close(false)} size="sm" title="Xác nhận"
        footer={dialog && <>
          <button className="btn" onClick={() => close(false)}>Hủy</button>
          <button className={`btn ${dialog.danger ? 'btn--solid-danger' : 'btn--primary'}`} onClick={() => close(true)} autoFocus>{dialog.confirmText ?? 'Xác nhận'}</button>
        </>}>
        {dialog && (
          <>
            <div className={`confirm-icon ${dialog.danger ? '' : 'confirm-icon--blue'}`}><DialogIcon size={22} /></div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>{dialog.title}</h3>
            {dialog.text && <p className="muted fs-13">{dialog.text}</p>}
          </>
        )}
      </Modal>
    </Ctx.Provider>
  );
}

export function useFeedback(): FeedbackValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFeedback phải nằm trong FeedbackProvider');
  return v;
}
