import { Suspense } from 'react'
import HeroSkeleton from './HeroSkeleton'
import ArticleSkeleton from './ArticleSkeleton'

export default function PageLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breaking News Banner Skeleton */}
      <div className="bg-red-600 py-2 border-b border-red-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-white h-6 w-24 rounded animate-pulse"></div>
            <div className="bg-red-500 h-5 flex-1 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main News Section */}
          <div className="xl:col-span-3">
            {/* Title skeleton */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-gray-300 h-8 w-64 rounded animate-pulse"></div>
            </div>
            
            {/* Hero skeleton */}
            <div className="mb-6 sm:mb-8">
              <HeroSkeleton />
            </div>

            {/* Secondary news title */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-gray-300 h-7 w-48 rounded animate-pulse"></div>
            </div>

            {/* Grid of article skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6 sm:space-y-8">
            {/* Editorial skeleton */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-6 w-32 rounded mb-4"></div>
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                </div>
              </div>
              <div className="bg-gray-200 h-4 w-48 rounded"></div>
            </div>

            {/* Weather skeleton */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-6 w-24 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="bg-gray-200 h-20 w-full rounded"></div>
                <div className="bg-gray-200 h-16 w-full rounded"></div>
              </div>
            </div>

            {/* Most read skeleton */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-6 w-32 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="bg-gray-200 h-8 w-8 rounded"></div>
                    <div className="bg-gray-200 h-16 w-16 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories skeleton */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-6 w-28 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3">
                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    <div className="bg-gray-200 h-5 w-8 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter skeleton */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="bg-gray-300 h-6 w-40 rounded mb-3"></div>
              <div className="bg-gray-200 h-4 w-full rounded mb-4"></div>
              <div className="bg-gray-200 h-10 w-full rounded mb-2"></div>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
