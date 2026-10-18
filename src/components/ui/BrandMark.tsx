import { cn } from '../../lib/utils';

interface BrandMarkProps {
  /** Hide the wordmark, showing just the logo mark. */
  iconOnly?: boolean;
  /** Hide wordmark on small screens. */
  compact?: boolean;
  className?: string;
}

/** Redesign lockup: brand mark + upright Label-style wordmark. */
export function BrandMark({ iconOnly, compact, className }: BrandMarkProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <img
        src="/images/brand_mark.png"
        alt=""
        width={22}
        height={21}
        className="h-[21px] w-[22px] shrink-0 object-contain"
      />
      {!iconOnly && (
        <span
          className={cn(
            'truncate text-[12px] font-semibold uppercase tracking-[0.18em] text-txt-hi',
            compact && 'hidden sm:inline'
          )}
        >
          Hybrid Athlete
        </span>
      )}
    </div>
  );
}
