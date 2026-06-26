import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrandMarkProps {
  /** Hide the wordmark, showing just the logo tile. */
  iconOnly?: boolean;
  className?: string;
}

/** The Hybrid Athlete lockup: red-gradient tile + lightning + italic wordmark. */
export function BrandMark({ iconOnly, className }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-grad-red shadow-red">
        <Zap className="h-[18px] w-[18px] fill-white text-white" />
      </span>
      {!iconOnly && (
        <span className="font-display text-sm font-extrabold italic tracking-wide text-txt-hi">
          HYBRID<span className="text-brand">·</span>ATHLETE
        </span>
      )}
    </div>
  );
}
