import { motion } from 'framer-motion';
import { spring } from '../../design/motion';
import { cn } from '../../lib/utils';

interface SetCheckmarkProps {
  checked: boolean;
  className?: string;
  onToggle?: () => void;
}

/** fitness-dataviz skill — animated SVG check on set completion. */
export function SetCheckmark({ checked, className, onToggle }: SetCheckmarkProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        'grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
        checked
          ? 'border-success/40 bg-success/15 text-success'
          : 'border-hair bg-surface-3 text-txt-lo hover:border-hair-strong',
        className
      )}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
        <motion.path
          d="M5 12l5 5 9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: checked ? 1 : 0.35,
            scale: checked ? 1 : 0.85,
          }}
          transition={spring.snappy}
        />
      </svg>
    </button>
  );
}
