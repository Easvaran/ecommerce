
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Skeleton */}
      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          <Skeleton className="h-4 w-24 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-2xl" />
            <Skeleton className="h-16 md:h-24 w-full max-w-2xl rounded-3xl" />
            <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10">
        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <Skeleton className="h-14 w-full md:w-96 rounded-3xl" />
          <Skeleton className="h-14 w-full md:w-80 rounded-2xl" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800 shadow-sm p-0">
              <Skeleton className="h-64 w-full" />
              <div className="p-8 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>
                <Skeleton className="h-6 w-24 rounded-md mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
