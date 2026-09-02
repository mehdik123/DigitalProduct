import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrandMarkProps {
  /** Hide the wordmark, showing just the logo tile. */
  iconOnly?: boolean;
  /** Hide wordmark on small screens (logo tile only on mobile). */
  compact?: boolean;
  className?: string;
}

/** The Hybrid Athlete lockup: red-gradient tile + lightning + italic wordmark. */
export function BrandMark({ iconOnly, compact, className }: BrandMarkProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-grad-red shadow-red sm:h-9 sm:w-9 sm:rounded-[10px]">
        <Zap className="h-4 w-4 fill-white text-white sm:h-[18px] sm:w-[18px]" />
      </span>
      {!iconOnly && (
        <span
          className={cn(
            'truncate font-display text-xs font-extrabold italic tracking-wide text-txt-hi sm:text-sm',
            compact && 'hidden sm:inline'
          )}
        >
          HYBRID<span className="text-brand">·</span>ATHLETE
        </span>
      )}
    </div>
  );
}
