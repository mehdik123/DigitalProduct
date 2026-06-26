import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NumberInputProps {
  value: number | '';
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  label,
  suffix,
  disabled,
  className,
}: NumberInputProps) {
  const current = typeof value === 'number' ? value : 0;

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const dec = () => onChange(clamp(current - step));
  const inc = () => onChange(clamp(current + step));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      )}
      <div
        className={cn(
          'flex items-center rounded-2xl border border-white/10 bg-surface-3',
          'focus-within:border-brand/60 transition-colors',
          disabled && 'opacity-40'
        )}
      >
        <button
          type="button"
          onClick={dec}
          disabled={disabled}
          aria-label="decrease"
          className="grid h-12 w-12 place-items-center text-zinc-400 active:scale-90 transition-transform disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onChange(0);
              return;
            }
            const parsed = parseFloat(raw);
            if (!Number.isNaN(parsed)) onChange(clamp(parsed));
          }}
          className={cn(
            'tabular-nums min-w-0 flex-1 bg-transparent text-center text-xl font-bold text-white',
            'outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
        />
        {suffix && <span className="pr-3 text-sm font-medium text-zinc-500">{suffix}</span>}
        <button
          type="button"
          onClick={inc}
          disabled={disabled}
          aria-label="increase"
          className="grid h-12 w-12 place-items-center text-zinc-400 active:scale-90 transition-transform disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
