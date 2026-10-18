import { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface EyebrowProps {
  children: ReactNode;
  /** Show the 18×2 red rule on the left. */
  pip?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Label kicker: Barlow 600 11 / +0.14em / uppercase, optional red rule. */
export function Eyebrow({ children, pip = true, className, style }: EyebrowProps) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex w-fit items-center gap-2.5',
        'text-[11px] font-semibold uppercase tracking-[0.16em] text-txt-mid',
        className
      )}
    >
      {pip && <span className="block h-0.5 w-[18px] shrink-0 bg-brand" aria-hidden />}
      {children}
    </span>
  );
}
