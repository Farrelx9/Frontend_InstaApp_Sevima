export default function PostCardSkeleton() {
  return (
    <article className="bg-black border border-[#262626] rounded-2xl overflow-hidden mb-4 sm:mb-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-[#1a1a1a] rounded" />
            <div className="h-2 w-16 bg-[#1a1a1a] rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a]" />
      </div>

      {/* Media Skeleton */}
      <div className="w-full aspect-square bg-[#1a1a1a]" />

      {/* Actions & Content Skeleton */}
      <div className="px-3 sm:px-4 pt-3 pb-4 space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a]" />
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a]" />
            <div className="w-6 h-6 rounded-full bg-[#1a1a1a]" />
          </div>
          <div className="w-7 h-7 rounded-full bg-[#1a1a1a]" />
        </div>
        <div className="h-3 w-20 bg-[#1a1a1a] rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#1a1a1a] rounded" />
          <div className="h-3 w-3/4 bg-[#1a1a1a] rounded" />
        </div>
      </div>
    </article>
  );
}
