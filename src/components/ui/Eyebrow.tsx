import { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface EyebrowProps {
  children: ReactNode;
  /** Show the signature red pip on the left. */
  pip?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Uppercase pill label with an optional glowing red pip — the section kicker. */
export function Eyebrow({ children, pip = true, className, style }: EyebrowProps) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center gap-2 self-start rounded-full border border-hair bg-glass px-3 py-1.5',
        'text-[11px] font-semibold uppercase tracking-[0.18em] text-txt-mid',
        className
      )}
    >
      {pip && (
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--red)]" />
      )}
      {children}
    </span>
  );
}
