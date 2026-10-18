import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/** 40×40, radius 12, surface-1 — redesign icon button. */
export function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'grid h-10 w-10 place-items-center rounded-xl bg-surface-1 text-txt-hi',
        'transition-colors hover:bg-surface-2 active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
