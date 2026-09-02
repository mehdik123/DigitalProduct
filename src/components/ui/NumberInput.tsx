import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { spring, tapSubtle } from '../../design/motion';
import { haptic } from '../../lib/haptics';

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
  const dec = () => {
    haptic.light();
    onChange(clamp(current - step));
  };
  const inc = () => {
    haptic.light();
    onChange(clamp(current + step));
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className="text-[8px] font-black uppercase tracking-wider text-txt-lo">{label}</span>
      )}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          'flex items-center rounded-[1.1rem] border border-white/10 bg-surface-3/80 transition-colors focus-within:border-brand/40',
          disabled && 'opacity-40'
        )}
      >
        <StepBtn onClick={dec} disabled={disabled} aria-label="decrease">
          <Minus className="h-3.5 w-3.5" strokeWidth={3} />
        </StepBtn>
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
          className="tabular-nums min-w-0 flex-1 bg-transparent text-center text-base font-bold text-txt-hi outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && <span className="pr-2 text-[9px] font-bold text-txt-lo">{suffix}</span>}
        <StepBtn onClick={inc} disabled={disabled} aria-label="increase">
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        </StepBtn>
      </motion.div>
    </div>
  );
}

function StepBtn({
  children,
  disabled,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : tapSubtle}
      transition={spring.snappy}
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-txt-mid transition-colors hover:border-brand/30 hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </motion.button>
  );
}
