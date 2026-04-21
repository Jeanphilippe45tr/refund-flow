import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  positive?: boolean;
  gradient?: boolean;
  /** Optional numeric value to enable count-up animation. Falls back to `value` string when omitted. */
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const StatCard = ({
  title,
  value,
  icon,
  change,
  positive,
  gradient,
  numericValue,
  prefix,
  suffix,
  decimals,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -4 }}
    className={`group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden ${
      gradient
        ? 'gradient-primary text-primary-foreground shadow-lg'
        : 'premium-card'
    }`}
  >
    {/* subtle hover sheen */}
    {!gradient && (
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(400px circle at 100% 0%, hsl(var(--primary) / 0.08), transparent 60%)' }}
      />
    )}
    <div className="relative flex items-start justify-between">
      <div>
        <p className={`text-sm font-medium ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
        <p className="text-2xl font-bold mt-1">
          {typeof numericValue === 'number' ? (
            <AnimatedCounter value={numericValue} prefix={prefix} suffix={suffix} decimals={decimals} />
          ) : (
            value
          )}
        </p>
        {change && (
          <p className={`text-xs mt-2 font-medium ${positive ? 'text-success' : 'text-destructive'} ${gradient ? '!text-primary-foreground/90' : ''}`}>
            {positive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${gradient ? 'bg-primary-foreground/20' : 'bg-accent'}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);
