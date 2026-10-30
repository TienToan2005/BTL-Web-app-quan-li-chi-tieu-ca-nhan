import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { moneyNum } from '../lib/format';

/** Nền cực quang: ba khối sáng trôi chậm, kèm lưới chấm mờ. */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <span className="aurora__blob aurora__blob--a" />
      <span className="aurora__blob aurora__blob--b" />
      <span className="aurora__blob aurora__blob--c" />
    </div>
  );
}

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface GlowCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Nghiêng 3D theo con trỏ (dùng cho thẻ chính). */
  tilt?: boolean;
}

/** Thẻ kính: ánh sáng đi theo con trỏ, tùy chọn nghiêng 3D như đang lơ lửng. */
export function GlowCard({ children, className = '', tilt = false, style, onPointerMove, onPointerLeave, ...rest }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const el = ref.current;
    if (!el || !canHover()) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.classList.add('is-lit');
    if (tilt && !reduced()) {
      ry.set((x / r.width - 0.5) * 7);
      rx.set(-(y / r.height - 0.5) * 7);
    }
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    ref.current?.classList.remove('is-lit');
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref} className={`card ${className}`} onPointerMove={move} onPointerLeave={leave}
      style={tilt ? { ...style, rotateX: srx, rotateY: sry, transformPerspective: 1100 } : style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Số tiền đếm lên mượt mỗi khi giá trị đổi. */
export function AnimatedMoney({ value, sign = false }: { value: number; sign?: boolean }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, v => `${sign ? (v > 0.5 ? '+' : v < -0.5 ? '−' : '') : ''}${moneyNum(Math.abs(v))}`);
  useEffect(() => {
    if (reduced()) { mv.set(value); return; }
    const c = animate(mv, value, { duration: 1.1, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [value, mv]);
  return <span className="money"><motion.span>{text}</motion.span><span className="cur">đ</span></span>;
}
