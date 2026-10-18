import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
}

/** Redesign input: 56px, radius 12, surface-1, inset hairline, red focus. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, trailing, invalid, ...props },
  ref
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-txt-lo">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'h-14 w-full rounded-xl bg-surface-1 px-4 text-base font-medium text-txt-hi',
          'placeholder:text-txt-lo',
          'shadow-[inset_0_0_0_1px_#2E2C29]',
          'transition-[box-shadow] duration-150',
          'focus:outline-none focus:shadow-[inset_0_0_0_1.5px_#E8112D]',
          invalid && 'shadow-[inset_0_0_0_1.5px_#E8112D]',
          icon && 'pl-11',
          trailing && 'pr-12',
          className
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-lo">{trailing}</span>
      )}
    </div>
  );
});

interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-txt-mid">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-[13px] font-medium text-brand">{error}</span>}
    </div>
  );
}
