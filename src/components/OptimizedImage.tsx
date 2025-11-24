'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getValidImageUrl, DEFAULT_IMAGE_URL } from '@/utils/imageUtils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

const OptimizedImage = ({ 
  src, 
  alt, 
  width = 600, 
  height = 400, 
  className = '', 
  fill = false,
  priority = false,
  sizes 
}: OptimizedImageProps) => {
  // Validar y obtener URL segura inmediatamente
  const validatedSrc = src ? getValidImageUrl(src) : DEFAULT_IMAGE_URL
  const [imgSrc, setImgSrc] = useState(validatedSrc)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // URL de imagen de fallback
  const fallbackImage = DEFAULT_IMAGE_URL

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackImage)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Verificar si la URL es válida
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Si la URL no es válida, usar fallback inmediatamente
  const imageSrc = isValidUrl(imgSrc) ? imgSrc : fallbackImage

  if (fill) {
    // Para imágenes con fill, devolver directamente el elemento Image
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
        />
      </>
    )
  }

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: '100%', height: 'auto' }}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  )
}

export default OptimizedImage