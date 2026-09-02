import { Skeleton } from './ui';

/** Minimal shell shown while lazy routes load. */
export default function PageLoader() {
  return (
    <div className="min-h-dvh bg-app pt-chrome px-4 py-6">
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
