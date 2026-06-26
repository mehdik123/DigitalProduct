import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Tone = 'default' | 'brand' | 'emerald';

interface PillProps {
  children: ReactNode;
  /** Show a leading colored dot. */
  dot?: boolean;
  tone?: Tone;
  className?: string;
}

const dotTone: Record<Tone, string> = {
  default: 'bg-txt-mid',
  brand: 'bg-brand shadow-[0_0_8px_var(--red)]',
  emerald: 'bg-emerald shadow-[0_0_8px_rgba(52,211,153,.6)]',
};

const textTone: Record<Tone, string> = {
  default: 'text-txt-mid',
  brand: 'text-brand',
  emerald: 'text-emerald',
};

/** Small uppercase glass label with an optional colored dot. */
export function Pill({ children, dot, tone = 'default', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-hair bg-glass px-3 py-1.5',
        'text-[10.5px] font-semibold uppercase tracking-[0.14em]',
        textTone[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotTone[tone])} />}
      {children}
    </span>
  );
}
