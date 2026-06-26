import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { tap } from '../../design/motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children?: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** When set, renders the richer CTA layout (icon tile + title + subtitle + arrow). */
  subtitle?: ReactNode;
  /** Show a trailing chevron that nudges on hover. */
  arrow?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-grad-red text-white shadow-red hover:brightness-[1.06] disabled:opacity-40',
  secondary:
    'bg-glass text-txt-hi border border-hair-strong backdrop-blur-md hover:bg-glass-hi hover:border-white/20 disabled:opacity-40',
  ghost:
    'bg-transparent text-txt-mid hover:bg-white/5 hover:text-txt-hi disabled:opacity-40',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm rounded-xl',
  md: 'h-12 px-5 text-[15px] rounded-2xl',
  lg: 'h-14 px-6 text-base rounded-2xl',
};

/** Icon-tile styling per variant for the CTA layout. */
const ctaIcon: Record<Variant, string> = {
  primary: 'bg-white/[0.18] border border-white/25 text-white',
  secondary: 'bg-surface-3 border border-hair-strong text-txt-hi',
  ghost: 'bg-white/5 border border-hair text-txt-hi',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  subtitle,
  arrow,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base = cn(
    'group relative inline-flex select-none items-center justify-center gap-2 font-bold tracking-wide',
    'transition-[background,border-color,filter,transform] duration-200 ease-smooth',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  );

  // Rich CTA layout (icon tile + stacked title/subtitle + trailing arrow).
  if (subtitle) {
    return (
      <motion.button
        whileTap={disabled ? undefined : tap}
        disabled={disabled}
        className={cn(base, variants[variant], 'rounded-2xl px-4 py-4 text-left', className)}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px]',
              ctaIcon[variant]
            )}
          >
            {icon}
          </span>
        )}
        <span className="flex-1">
          <span className="block font-display text-lg font-extrabold uppercase italic leading-none tracking-wide">
            {children}
          </span>
          <span
            className={cn(
              'mt-1 block text-[11.5px] font-medium normal-case not-italic tracking-normal',
              variant === 'primary' ? 'text-white/80' : 'text-txt-mid'
            )}
          >
            {subtitle}
          </span>
        </span>
        <ChevronRight
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-300 ease-spring group-hover:translate-x-1',
            variant === 'primary' ? 'text-white/90' : 'text-txt-lo'
          )}
        />
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={disabled ? undefined : tap}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {arrow && (
        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
      )}
    </motion.button>
  );
}
