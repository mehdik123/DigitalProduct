import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { tap } from '../../design/motion';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: ReactNode;
  /** Required for accessibility — describes the action. */
  'aria-label': string;
}

/** 38px square glass button with a hairline border and press feedback. */
export function IconButton({ className, disabled, children, ...props }: IconButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : tap}
      disabled={disabled}
      className={cn(
        'flex h-[38px] w-[38px] items-center justify-center rounded-xl',
        'border border-hair bg-glass text-txt-mid',
        'transition-colors duration-200 hover:bg-glass-hi hover:text-txt-hi',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
