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
  // Doble validación: primero verificar si es una URL problemática de Google
  const safeSrc = src && (src.includes('share.google') || src.includes('Xw8NSUkRYIbPyn0pP')) 
    ? DEFAULT_IMAGE_URL 
    : src
  
  // Validar y obtener URL segura inmediatamente
  const validatedSrc = getValidImageUrl(safeSrc)
  const [imgSrc, setImgSrc] = useState(validatedSrc)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // URL de imagen de fallback
  const fallbackImage = DEFAULT_IMAGE_URL

  const handleError = () => {
    if (!hasError) {
      // Solo logear errores que no sean de URLs problemáticas conocidas
      const shouldLog = !imgSrc.includes('share.google') && 
                       !imgSrc.includes('invalid') && 
                       !imgSrc.includes('example.com')
      
      if (shouldLog) {
        console.warn(`Image failed to load: ${imgSrc}. Using fallback.`)
      }
      
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
      />
    )
  }

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`} style={{ width, height }}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" style={{ width, height }} />
      )}
    </div>
  )
}

export default OptimizedImage