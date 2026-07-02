import { motion } from 'framer-motion';
import { spring } from '../../design/motion';
import { cn } from '../../lib/utils';

interface ProgressRingProps {
  /** 0–1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

const R = 52;
const C = 2 * Math.PI * R;

/** fitness-dataviz skill — animated close-the-ring progress. */
export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  label,
}: ProgressRingProps) {
  const pct = Math.max(0, Math.min(1, value));
  const offset = C * (1 - pct);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        aria-hidden={!label}
        role={label ? 'img' : undefined}
        aria-label={label}
      >
        <defs>
          <linearGradient id="ring-brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#FF6A4D" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={R}
          stroke="var(--surface-3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          stroke="url(#ring-brand)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={spring.ring}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="stat text-sm font-semibold text-txt-hi sm:text-lg">
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}
