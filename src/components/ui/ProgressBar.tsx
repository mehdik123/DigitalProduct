import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0..1
  className?: string;
  tone?: 'brand' | 'success';
  height?: number;
}

export function ProgressBar({ value, className, tone = 'brand', height = 8 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-white/8', className)}
      style={{ height }}
    >
      <motion.div
        className={cn('h-full rounded-full', tone === 'success' ? 'bg-success' : 'bg-brand')}
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
