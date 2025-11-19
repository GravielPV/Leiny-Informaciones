'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentLiveVideo } from '@/lib/supabase/liveVideos'
import type { LiveVideo } from '@/utils/youtubeUtils'

export default function LiveVideoButton() {
  const [currentVideo, setCurrentVideo] = useState<LiveVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentVideo = async () => {
      setIsLoading(true)
      try {
        const video = await getCurrentLiveVideo()
        setCurrentVideo(video)
      } catch {
        // Fail silently
        setCurrentVideo(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentVideo()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchCurrentVideo, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !currentVideo) {
    return null
  }

  return (
    <Link 
      href={`/live/${currentVideo.id}`}
      className="relative bg-red-600 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 group"
    >
      {currentVideo.is_live && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
      <span className="group-hover:scale-105 transition-transform">
        {currentVideo.is_live ? '🔴 En Vivo' : '📺 Video'}
      </span>
      {currentVideo.is_live && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </Link>
  )
}
