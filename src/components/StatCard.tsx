import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  positive?: boolean;
  gradient?: boolean;
}

export const StatCard = ({ title, value, icon, change, positive, gradient }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${
      gradient
        ? 'gradient-primary text-primary-foreground shadow-lg'
        : 'bg-card border border-border shadow-card hover:shadow-card-hover'
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-sm font-medium ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={`text-xs mt-2 font-medium ${positive ? 'text-success' : 'text-destructive'} ${gradient ? '!text-primary-foreground/90' : ''}`}>
            {positive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${gradient ? 'bg-primary-foreground/20' : 'bg-accent'}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);
