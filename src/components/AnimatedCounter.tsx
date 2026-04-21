import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Animates a number from 0 → value when it scrolls into view (or on mount).
 */
export const AnimatedCounter = ({
  value,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) => {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const from = 0;
      const to = Number.isFinite(value) ? value : 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const el = elRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && start());
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={elRef} className={className}>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
