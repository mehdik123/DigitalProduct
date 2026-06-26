import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon rendered inside the field. */
  icon?: ReactNode;
  invalid?: boolean;
}

/** Token-driven text input: surface-2 bg, hairline border, brand focus ring. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, invalid, ...props },
  ref
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-lo">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'h-12 w-full rounded-[18px] border bg-surface-2 px-4 text-[15px] text-txt-hi',
          'placeholder:text-txt-lo',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
          invalid ? 'border-brand/60 focus:border-brand' : 'border-hair focus:border-hair-strong',
          icon && 'pl-10',
          className
        )}
        {...props}
      />
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

/** Label + control + error wrapper for forms. */
export function Field({ label, htmlFor, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-txt-mid"
        >
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-xs font-medium text-brand">{error}</span>}
    </div>
  );
}
