import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  interactive?: boolean;
  accent?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive, accent, children, ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-3xl border bg-surface-2 p-5',
        accent ? 'border-brand/35' : 'border-white/8',
        interactive && 'transition-colors duration-200 hover:border-white/20',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});
