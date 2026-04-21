import { useEffect, useRef } from 'react';

interface SpotlightBackgroundProps {
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Animated grid backdrop with a spotlight that follows the cursor.
 * Pure CSS + a single rAF-throttled mousemove handler for performance.
 */
export const SpotlightBackground = ({ variant = 'light', className = '' }: SpotlightBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      style={{
        // Defaults so SSR/first paint is centered
        ['--mx' as any]: '50vw',
        ['--my' as any]: '30vh',
      }}
    >
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid-pan opacity-[0.35] dark:opacity-[0.25]" />
      {/* Spotlight following cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), hsl(var(--primary) / 0.18), transparent 60%)`,
        }}
      />
      {/* Soft top-right accent orb */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
      {/* Soft bottom-left gold orb */}
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-secondary/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
    </div>
  );
};
