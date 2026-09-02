import { Skeleton } from './Skeleton';

/** Layout-matched loading state for the compact workouts feed. */
export function WorkoutFeedSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="flex gap-2 overflow-hidden py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[4.5rem] w-[3.4rem] shrink-0 rounded-[1.1rem]" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[3.75rem] w-full rounded-[1.35rem]" />
        ))}
      </div>
    </div>
  );
}
