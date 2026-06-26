import { Lock, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LockBadgeProps {
  state: 'locked' | 'active' | 'completed';
  className?: string;
  size?: number;
}

export function LockBadge({ state, className, size = 16 }: LockBadgeProps) {
  if (state === 'completed') {
    return (
      <span
        className={cn(
          'grid place-items-center rounded-full bg-success/15 text-success',
          className
        )}
        style={{ width: size + 12, height: size + 12 }}
      >
        <Check size={size} strokeWidth={3} />
      </span>
    );
  }

  if (state === 'locked') {
    return (
      <span
        className={cn(
          'grid place-items-center rounded-full bg-white/5 text-zinc-500',
          className
        )}
        style={{ width: size + 12, height: size + 12 }}
      >
        <Lock size={size} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'grid place-items-center rounded-full bg-brand/15 text-brand',
        className
      )}
      style={{ width: size + 12, height: size + 12 }}
    >
      <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
    </span>
  );
}
