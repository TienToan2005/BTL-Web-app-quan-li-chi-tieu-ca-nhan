import { useEffect, useState } from 'react';

/** Thời gian hiện tại, cập nhật mỗi 30 giây. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

/** Hiện chữ dần dần; tắt hiệu ứng khi người dùng bật reduced-motion. */
export function useTypewriter(text: string | undefined, step = 3, delay = 18) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (!text) { setShown(''); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(text); return; }
    let i = 0;
    setShown('');
    const t = window.setInterval(() => {
      i += step;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(t);
    }, delay);
    return () => window.clearInterval(t);
  }, [text, step, delay]);
  return shown;
}

export function useDebounced<T>(value: T, ms = 350): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}
