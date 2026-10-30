import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, CheckCircle2, CircleDollarSign, Eye, EyeOff, PiggyBank } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Aurora } from '../components/fx';
import { Field, Input, Spinner } from '../components/ui';

function Frame({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <main className="auth">
      <Aurora />
      <section className="auth__side">
        <div className="auth__logo"><span className="auth__mark"><CircleDollarSign size={22} /></span>Zero-G Budget</div>
        <div>
          <h2 className="auth__headline">Tiền của bạn, nhẹ như không.</h2>
          <p className="auth__lead">Ghi thu chi, đặt ngân sách cho từng danh mục và xem báo cáo rõ ràng trong một nơi.</p>
          <div className="auth__stage" aria-hidden>
            <div className="surface auth__float" style={{ left: 0, top: 10, ['--d' as string]: '0s' }}><span className="stat__icon stat__icon--income"><ArrowDownLeft size={19} /></span><div><div className="fs-13 muted">Thu nhập</div><strong style={{ fontFamily: 'var(--display)' }}>Theo dõi từng khoản</strong></div></div>
            <div className="surface auth__float" style={{ left: '34%', top: 92, ['--d' as string]: '-2s' }}><span className="stat__icon stat__icon--expense"><ArrowUpRight size={19} /></span><div><div className="fs-13 muted">Chi tiêu</div><strong style={{ fontFamily: 'var(--display)' }}>Biết tiền đi đâu</strong></div></div>
            <div className="surface auth__float" style={{ left: '8%', top: 172, ['--d' as string]: '-4s' }}><span className="stat__icon stat__icon--blue"><PiggyBank size={19} /></span><div><div className="fs-13 muted">Ngân sách</div><strong style={{ fontFamily: 'var(--display)' }}>Cảnh báo kịp thời</strong></div></div>
          </div>
        </div>
      </section>
      <div className="auth__main">
        <motion.div className="card auth__card" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 22 }}>
          <h1 className="auth__title">{title}</h1>
          <p className="auth__sub">{sub}</p>
          {children}
        </motion.div>
      </div>
    </main>
  );
}

const Banner = ({ kind, message }: { kind: 'error' | 'success'; message: string }) => (
  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={`banner banner--${kind}`} role="alert">
    {kind === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}<span>{message}</span>
  </motion.div>
);

export function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ u?: string; p?: string }>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = { u: username.trim() ? undefined : 'Nhập tên đăng nhập.', p: password ? undefined : 'Nhập mật khẩu.' };
    setErrors(next); setError('');
    if (next.u || next.p) return;
    setBusy(true);
    try { await login(username, password); nav('/dashboard', { replace: true }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Tên đăng nhập hoặc mật khẩu chưa đúng.'); }
    finally { setBusy(false); }
  }

  return (
    <Frame title="Đăng nhập" sub="Tiếp tục theo dõi thu chi của bạn.">
      <form onSubmit={submit} noValidate className="grid" style={{ gap: 18 }}>
        {error && <Banner kind="error" message={error} />}
        <Field label="Tên đăng nhập" error={errors.u}>{id => <Input id={id} placeholder="Nhập tên đăng nhập" autoComplete="username" autoFocus invalid={!!errors.u} value={username} onChange={e => { setUsername(e.target.value); setErrors(x => ({ ...x, u: undefined })); setError(''); }} />}</Field>
        <Field label="Mật khẩu" error={errors.p}>{id => (
          <div className="input-affix" style={{ position: 'relative' }}>
            <Input id={id} type={show ? 'text' : 'password'} placeholder="Nhập mật khẩu" autoComplete="current-password" invalid={!!errors.p} style={{ paddingLeft: 14, paddingRight: 48 }} value={password} onChange={e => { setPassword(e.target.value); setErrors(x => ({ ...x, p: undefined })); setError(''); }} />
            <button type="button" className="btn btn--ghost btn--icon btn--sm" style={{ position: 'absolute', right: 6, top: 6 }} onClick={() => setShow(s => !s)} aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>)}</Field>
        <button className="btn btn--primary btn--lg btn--block" type="submit" disabled={busy}>{busy ? <><Spinner />Đang kiểm tra...</> : 'Đăng nhập'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>Chưa có tài khoản? <Link to="/register" className="link" style={{ display: 'inline' }}>Đăng ký</Link></p>
      </form>
    </Frame>
  );
}

export function Register() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => { setF(v => ({ ...v, [k]: e.target.value })); setErrors(x => ({ ...x, [k]: '' })); setFeedback(null); };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!f.username.trim()) next.username = 'Nhập tên đăng nhập.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) next.email = 'Nhập email hợp lệ.';
    if (f.password.length < 6) next.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    if (!f.confirm || f.confirm !== f.password) next.confirm = 'Mật khẩu xác nhận chưa khớp.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.register(f.username.trim(), f.email.trim(), f.password);
      setFeedback({ kind: 'success', message: 'Đăng ký thành công. Đang chuyển tới trang đăng nhập...' });
      window.setTimeout(() => nav('/login'), 1600);
    } catch (err) { setFeedback({ kind: 'error', message: err instanceof Error ? err.message : 'Đăng ký chưa thành công.' }); setBusy(false); }
  }

  const field = (k: keyof typeof f, label: string, type: string, ph: string, auto: string) => (
    <Field label={label} error={errors[k]}>{id => <Input id={id} type={type} placeholder={ph} autoComplete={auto} invalid={!!errors[k]} value={f[k]} onChange={set(k)} />}</Field>
  );
  return (
    <Frame title="Tạo tài khoản" sub="Bắt đầu ghi lại thu chi chỉ trong vài phút.">
      <form onSubmit={submit} noValidate className="grid" style={{ gap: 16 }}>
        {feedback && <Banner kind={feedback.kind} message={feedback.message} />}
        {field('username', 'Tên đăng nhập', 'text', 'Ví dụ: nguyenvana', 'username')}
        {field('email', 'Email', 'email', 'ten@example.com', 'email')}
        {field('password', 'Mật khẩu', 'password', 'Tối thiểu 6 ký tự', 'new-password')}
        {field('confirm', 'Xác nhận mật khẩu', 'password', 'Nhập lại mật khẩu', 'new-password')}
        <button className="btn btn--primary btn--lg btn--block" type="submit" disabled={busy}>{busy ? <><Spinner />Đang tạo tài khoản...</> : 'Đăng ký'}</button>
        <p className="muted" style={{ textAlign: 'center' }}>Đã có tài khoản? <Link to="/login" className="link" style={{ display: 'inline' }}>Đăng nhập</Link></p>
      </form>
    </Frame>
  );
}
