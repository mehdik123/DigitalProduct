import { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface StatStripItem {
  /** Main figure (e.g. "12", "4", "S+E"). */
  value: ReactNode;
  /** Small unit appended to the value (e.g. "wk", "/wk"). */
  unit?: ReactNode;
  /** Caption under the value. */
  label: ReactNode;
  /** Tint the value with the brand red. */
  accent?: boolean;
}

interface StatStripProps {
  items: StatStripItem[];
  className?: string;
  style?: CSSProperties;
}

/** The divided stat row from the preview — surface card with hairline dividers. */
export function StatStrip({ items, className, style }: StatStripProps) {
  return (
    <div
      style={style}
      className={cn(
        'flex items-stretch overflow-hidden rounded-[18px] border border-hair bg-surface-1',
        className
      )}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 px-2.5 py-3 text-center',
            i > 0 && 'border-l border-hair'
          )}
        >
          <div
            className={cn(
              'font-stat text-xl font-bold leading-none tabular-nums',
              item.accent ? 'text-brand' : 'text-txt-hi'
            )}
          >
            {item.value}
            {item.unit && <span className="text-[11px] text-txt-mid">{item.unit}</span>}
          </div>
          <div className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-txt-lo">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
