import { Skeleton } from './Skeleton';

/** screen-scaffold skill — layout-matched loading state for the workouts feed. */
export function WorkoutFeedSkeleton() {
  return (
    <div className="space-y-8 px-2 md:px-0">
      <div className="space-y-4 px-2">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-14 w-3/4 max-w-md rounded-2xl" />
        <Skeleton className="h-8 w-1/2 max-w-xs rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>
      <Skeleton className="mx-auto h-16 w-full max-w-xl rounded-2xl md:mx-0" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
