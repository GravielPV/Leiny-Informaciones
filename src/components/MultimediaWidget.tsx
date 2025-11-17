'use client'

import Link from 'next/link'
import { Image as ImageIcon, Play, Film } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface MultimediaItem {
  id: string
  title: string
  image_url?: string
  type: 'photo' | 'video'
  category?: string
}

interface MultimediaWidgetProps {
  items: MultimediaItem[]
}

export default function MultimediaWidget({ items }: MultimediaWidgetProps) {
  if (!items || items.length === 0) {
    return null
  }

  const featuredItem = items[0]
  const gridItems = items.slice(1, 5)

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4 border-b border-blue-200 pb-3">
        <Film className="w-5 h-5 text-purple-500" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Multimedia del Día
        </h3>
      </div>

      {/* Featured Item */}
      <Link
        href={`/articulos/${featuredItem.id}`}
        className="group block mb-4 relative overflow-hidden rounded-lg"
      >
        <div className="aspect-video relative">
          <OptimizedImage
            src={featuredItem.image_url || ''}
            alt={featuredItem.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
          
          {/* Play Icon for Videos */}
          {featuredItem.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 group-hover:bg-white rounded-full p-4 group-hover:scale-110 transition-all">
                <Play className="w-8 h-8 text-red-600 fill-current" />
              </div>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center space-x-2 mb-2">
              {featuredItem.type === 'video' ? (
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                  <Play className="w-3 h-3" />
                  <span>VIDEO</span>
                </span>
              ) : (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>GALERÍA</span>
                </span>
              )}
              {featuredItem.category && (
                <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                  {featuredItem.category}
                </span>
              )}
            </div>
            <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
              {featuredItem.title}
            </h4>
          </div>
        </div>
      </Link>

      {/* Grid of Thumbnails */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {gridItems.map((item) => (
            <Link
              key={item.id}
              href={`/articulos/${item.id}`}
              className="group relative aspect-video overflow-hidden rounded"
            >
              <OptimizedImage
                src={item.image_url || ''}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="150px"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
              
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {item.type === 'video' ? (
                  <Play className="w-6 h-6 text-white fill-current opacity-90" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-white opacity-90" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/multimedia"
          className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center space-x-1 transition-colors"
        >
          <span>Ver toda la galería</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
