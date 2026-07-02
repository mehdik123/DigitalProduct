import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

/** screen-scaffold skill — shimmer placeholder matching real layout boxes. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      aria-hidden
    />
  );
}
