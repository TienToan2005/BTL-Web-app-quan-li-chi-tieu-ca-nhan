import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { api } from '../lib/api';
import { useUser } from '../context/AuthContext';

interface Msg { id: number; from: 'me' | 'bot'; text: string; error?: boolean }

/** Trợ lý AI dạng bong bóng, gọi POST /ai/chat. */
export function AIChat() {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'bot', text: 'Chào bạn, mình có thể giúp gì về thu chi của bạn?' }]);
  const body = useRef<HTMLDivElement>(null);
  const seq = useRef(1);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }); }, [msgs, open, busy]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    setText('');
    setMsgs(m => [...m, { id: seq.current++, from: 'me', text: message }]);
    setBusy(true);
    try {
      const res = await api.chat(user.id, message);
      setMsgs(m => [...m, { id: seq.current++, from: 'bot', text: res.answer || 'Có chút trục trặc, bạn hỏi lại giúp mình nhé.' }]);
    } catch {
      setMsgs(m => [...m, { id: seq.current++, from: 'bot', text: 'Không kết nối được trợ lý AI. Thử lại sau ít phút.', error: true }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="surface chat" role="dialog" aria-label="Trợ lý AI" style={{ transformOrigin: 'bottom right' }}
            initial={{ opacity: 0, y: 20, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <div className="row between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
              <strong style={{ fontFamily: 'var(--display)' }}><Sparkles size={16} style={{ verticalAlign: '-2px', marginRight: 8, color: 'var(--cyan)' }} />Trợ lý AI</strong>
              <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setOpen(false)} aria-label="Đóng"><X size={16} /></button>
            </div>
            <div className="chat__body" ref={body} aria-live="polite">
              {msgs.map(m => <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`chat__msg chat__msg--${m.from} ${m.error ? 'text-expense' : ''}`}>{m.text}</motion.div>)}
              {busy && <div className="chat__msg chat__msg--bot"><span className="typing"><i /><i /><i /></span></div>}
            </div>
            <form onSubmit={send} className="row" style={{ padding: 12, borderTop: '1px solid var(--line)' }}>
              <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Nhập câu hỏi..." aria-label="Câu hỏi cho trợ lý AI" autoComplete="off" autoFocus />
              <button className="btn btn--primary btn--icon" type="submit" disabled={busy} aria-label="Gửi"><Send size={17} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button className="chat-fab" onClick={() => setOpen(o => !o)} aria-label="Mở trợ lý AI" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08, rotate: open ? 0 : -6 }}
        animate={{ y: [0, -5, 0] }} transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}>
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>
    </>
  );
}
