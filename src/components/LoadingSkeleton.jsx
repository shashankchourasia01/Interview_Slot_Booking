const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
      />
    ))}
  </div>
)

export default LoadingSkeleton
