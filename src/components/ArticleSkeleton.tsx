export default function ArticleSkeleton() {
  return (
    <article className="group bg-white border border-gray-200 overflow-hidden rounded-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4">
        {/* Category and date */}
        <div className="flex items-center justify-between mb-3">
          <div className="bg-gray-200 h-6 w-20 rounded-sm"></div>
          <div className="bg-gray-200 h-4 w-24 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="bg-gray-300 h-5 w-full rounded"></div>
          <div className="bg-gray-300 h-5 w-4/5 rounded"></div>
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2 mb-3">
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
        </div>
        
        {/* Read more */}
        <div className="bg-gray-200 h-4 w-20 rounded"></div>
      </div>
    </article>
  )
}
