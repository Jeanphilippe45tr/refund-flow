import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Wraps a page in a smooth fade + slight-rise transition.
 * Use inside route components to get consistent page-in animations.
 */
export const PageTransition = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
