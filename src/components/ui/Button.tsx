import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { haptic } from '../../lib/haptics';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
  /** @deprecated Redesign CTAs are flat labels; subtitle is ignored visually. */
  subtitle?: ReactNode;
  arrow?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-deep active:bg-brand-deep disabled:opacity-40 active:duration-100',
  secondary:
    'bg-transparent text-txt-hi shadow-[inset_0_0_0_1px_#3E3B37] hover:bg-white/[0.03] active:bg-white/[0.05] disabled:opacity-40',
  ghost:
    'bg-transparent text-txt-mid hover:bg-white/[0.04] hover:text-txt-hi disabled:opacity-40',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm rounded-[12px]',
  md: 'h-12 px-5 text-[15px] rounded-[14px]',
  lg: 'h-14 px-6 text-base rounded-[14px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  subtitle: _subtitle,
  arrow,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.12 }}
      onTapStart={() => !disabled && haptic.light()}
      disabled={disabled}
      className={cn(
        'group relative inline-flex select-none items-center justify-center gap-2.5',
        'font-semibold tracking-[0.01em]',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed',
        fullWidth && 'w-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {arrow && (
        <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      )}
    </motion.button>
  );
}
