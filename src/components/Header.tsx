'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { getCurrentLiveVideo } from '@/lib/supabase/liveVideos'
import type { LiveVideo } from '@/utils/youtubeUtils'

const navigation = [
  { name: 'Última Hora', href: '/categoria/ultima-hora' },
  { name: 'Política', href: '/categoria/politica' },
  { name: 'Mundo', href: '/categoria/mundo' },
  { name: 'Opinión', href: '/categoria/opinion' },
  { name: 'Deportes', href: '/categoria/deportes' },
  { name: 'Sociedad', href: '/categoria/sociedad' },
  { name: 'Economía', href: '/categoria/economia' },
  { name: 'Cultura', href: '/categoria/cultura' },
]

function LiveVideoButton() {
  const [currentVideo, setCurrentVideo] = useState<LiveVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentVideo = async () => {
      setIsLoading(true)
      try {
        const video = await getCurrentLiveVideo()
        setCurrentVideo(video)
      } catch (error) {
        console.error('Error fetching live video:', error)
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

function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }

    // Actualizar inmediatamente
    updateTime()
    
    // Actualizar cada segundo
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <span className="font-medium">
        🇩🇴 República Dominicana - {currentDate || 'cargando...'}
      </span>
      <span className="font-medium">
        🕒 {currentTime || '--:--'}
      </span>
    </>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      {/* Top bar - responsive */}
      <div className="bg-gray-900 text-white py-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-1 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <CurrentDateTime />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LiveVideoButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main header - responsive */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3">
          {/* Logo - responsive */}
          <div className="flex items-center flex-1">
            <Link href="/" className="group flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                <Image 
                  src="/logo2.jpg" 
                  alt="Las Informaciones con Leyni Logo" 
                  width={48}
                  height={48}
                  className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg lg:text-2xl font-black text-gray-900 mb-0 truncate">
                  Las Informaciones con Leyni
                </h1>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide hidden sm:block">
                  Periodismo independiente y responsable
                </p>
              </div>
            </Link>
          </div>

          {/* Search and Actions */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 xl:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex-shrink-0">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation - responsive */}
      <nav className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="hidden lg:flex space-x-2 xl:space-x-8 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium text-xs xl:text-sm uppercase tracking-wide py-2 px-2 xl:px-3 border-b-2 border-transparent hover:border-blue-600 transition-all whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-3 sm:px-4 py-4 space-y-4 max-h-96 overflow-y-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </form>
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center border border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}