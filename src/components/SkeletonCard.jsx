export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E0] flex flex-col">
      <div className="h-[260px] skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton-shimmer rounded w-3/4" />
        <div className="flex gap-5">
          <div className="h-4 skeleton-shimmer rounded w-16" />
          <div className="h-4 skeleton-shimmer rounded w-12" />
          <div className="h-4 skeleton-shimmer rounded w-20" />
        </div>
        <div className="pt-2 space-y-3">
          <div className="h-7 skeleton-shimmer rounded w-24" />
          <div className="h-11 skeleton-shimmer rounded w-full" />
        </div>
      </div>
    </div>
  )
}
