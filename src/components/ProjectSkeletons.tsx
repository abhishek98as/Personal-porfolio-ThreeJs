export function ProjectCardSkeleton() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden animate-pulse">
      <div className="relative h-56 bg-white/5">
        {/* 3D canvas placeholder */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="p-4">
        <div className="card-gradient rounded-xl p-[1px]">
          <div className="rounded-[11px] bg-white/5 dark:bg-black/40 backdrop-blur-md p-4">
            {/* Title skeleton */}
            <div className="h-6 bg-white/10 rounded-md mb-2 animate-pulse" />
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            </div>
            {/* Actions skeleton */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 bg-white/5 rounded w-20 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-8 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-md p-8 text-center">
      <div className="text-red-400 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Projects</h3>
      <p className="text-red-300/80 text-sm mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}