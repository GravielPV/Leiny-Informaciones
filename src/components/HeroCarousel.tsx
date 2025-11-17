'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import ShareButtons from './ShareButtons'
import { Clock, Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import { calculateReadingTime, isNewArticle } from '@/utils/articleUtils'

interface Category {
  id: string
  name: string
  color?: string
}

interface CarouselArticle {
  id: string
  title: string
  excerpt: string
  image_url?: string
  created_at: string
  categories?: Category | Category[]
  content: string
}

interface HeroCarouselProps {
  articles: CarouselArticle[]
  autoPlayInterval?: number
}

export default function HeroCarousel({ articles, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredArticles = articles.slice(0, 5)

  useEffect(() => {
    if (!isAutoPlaying || featuredArticles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredArticles.length - 1 ? 0 : prevIndex + 1
      )
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredArticles.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? featuredArticles.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === featuredArticles.length - 1 ? 0 : currentIndex + 1
    goToSlide(newIndex)
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return null
  }

  const currentArticle = featuredArticles[currentIndex]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="relative bg-white border border-gray-200 overflow-hidden group">
      {/* Main carousel content */}
      <div className="relative">
        <Link href={`/articulos/${currentArticle.id}`} className="block">
          <div className="aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden bg-gray-200">
            <OptimizedImage 
              src={currentArticle.image_url || ''} 
              alt={currentArticle.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
              <div className="max-w-4xl">
                {/* Category and badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide rounded-sm">
                    {Array.isArray(currentArticle.categories) 
                      ? currentArticle.categories[0]?.name || 'Destacado'
                      : currentArticle.categories?.name || 'Destacado'
                    }
                  </span>
                  {isNewArticle(currentArticle.created_at) && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center space-x-1 animate-pulse">
                      <Flame className="w-3 h-3" />
                      <span>NUEVO</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1 text-xs sm:text-sm bg-black/30 px-2 py-1 rounded-sm">
                    <Clock className="w-3 h-3" />
                    <span>{calculateReadingTime(currentArticle.content)} min</span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 sm:mb-4 leading-tight text-shadow-lg hover:text-blue-300 transition-colors">
                  {currentArticle.title}
                </h1>

                {/* Excerpt */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-100 mb-4 line-clamp-2 max-w-3xl">
                  {currentArticle.excerpt}
                </p>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300 mb-4">
                  <span>{formatDate(currentArticle.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation arrows */}
        {featuredArticles.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Artículo anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Siguiente artículo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Share buttons */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
        <ShareButtons 
          articleId={currentArticle.id}
          title={currentArticle.title}
          compact
        />
      </div>

      {/* Indicators */}
      {featuredArticles.length > 1 && (
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-1.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir al artículo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
