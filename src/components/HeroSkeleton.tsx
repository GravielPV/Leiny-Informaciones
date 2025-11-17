export default function HeroSkeleton() {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden animate-pulse">
      {/* Hero image skeleton */}
      <div className="aspect-[16/9] lg:aspect-[21/9] bg-gray-200 relative">
        {/* Content overlay skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl">
            {/* Category badge */}
            <div className="bg-gray-300 h-7 w-24 rounded-sm mb-3"></div>
            
            {/* Title */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-300 h-8 sm:h-10 lg:h-12 w-full rounded"></div>
              <div className="bg-gray-300 h-8 sm:h-10 lg:h-12 w-4/5 rounded"></div>
            </div>
            
            {/* Excerpt */}
            <div className="space-y-2 mb-4">
              <div className="bg-gray-300 h-5 w-full max-w-3xl rounded"></div>
              <div className="bg-gray-300 h-5 w-3/4 max-w-3xl rounded"></div>
            </div>
            
            {/* Meta info */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-300 h-4 w-32 rounded"></div>
              <div className="bg-gray-300 h-4 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share buttons skeleton */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-center space-x-3">
          <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
          <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
          <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
        </div>
      </div>
      
      {/* Indicators skeleton */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex space-x-2">
        <div className="bg-gray-300 h-1.5 w-8 rounded-full"></div>
        <div className="bg-gray-300 h-1.5 w-1.5 rounded-full"></div>
        <div className="bg-gray-300 h-1.5 w-1.5 rounded-full"></div>
      </div>
    </div>
  )
}
