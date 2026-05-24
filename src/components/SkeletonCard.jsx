export default function SkeletonCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl overflow-hidden shadow-card">
      <div className="h-[260px] skeleton-shimmer" />
      <div className="p-6 space-y-4">
        <div className="h-5 skeleton-shimmer rounded w-3/4" />
        <div className="flex gap-5">
          <div className="h-4 skeleton-shimmer rounded w-16" />
          <div className="h-4 skeleton-shimmer rounded w-12" />
          <div className="h-4 skeleton-shimmer rounded w-20" />
        </div>
      </div>
      <div className="border-t border-border-light px-6 py-5 flex justify-between items-center">
        <div className="h-7 skeleton-shimmer rounded w-24" />
        <div className="h-10 skeleton-shimmer rounded w-28" />
      </div>
    </div>
  )
}
