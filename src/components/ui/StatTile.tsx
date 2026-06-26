import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatTileProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'default' | 'brand' | 'success';
  className?: string;
}

export function StatTile({ label, value, sub, tone = 'default', className }: StatTileProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-surface-2 px-4 py-3',
        className
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={cn(
          'tabular-nums mt-1 text-2xl font-extrabold leading-none',
          tone === 'brand' && 'text-brand',
          tone === 'success' && 'text-success',
          tone === 'default' && 'text-white'
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}
