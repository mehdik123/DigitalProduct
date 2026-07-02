import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatCounterProps {
  value: number;
  className?: string;
  format?: (n: number) => string;
}

/** fitness-dataviz skill — spring-animated stat numbers. */
export function StatCounter({ value, className, format }: StatCounterProps) {
  const mv = useSpring(0, { stiffness: 120, damping: 24 });
  const text = useTransform(mv, (v) =>
    format ? format(Math.round(v)) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  return (
    <motion.span className={cn('stat', className)} data-stat>
      {text}
    </motion.span>
  );
}
