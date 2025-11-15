'use client'

import dynamic from 'next/dynamic'

// Wrapper client component for weather widget to avoid SSR issues
const WeatherWidgetFrontend = dynamic(
  () => import('./WeatherWidgetFrontend'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
          <div className="h-8 bg-white/20 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
      </div>
    )
  }
)

export default WeatherWidgetFrontend