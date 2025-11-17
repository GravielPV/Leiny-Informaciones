/**
 * Utilidad para manejo seguro de URLs de imágenes
 */
import React from 'react'

// Lista de dominios problemáticos conocidos
const BLOCKED_DOMAINS = [
  'share.google',
  'share.google.com',
  'drive.google.com/file',
  'photos.google.com',
  'googleusercontent.com',
  'invalid',
  'test',
  'example.com',
  'localhost:3000' // Evitar referencias circulares
]

// Lista de patrones de URLs problemáticas
const BLOCKED_PATTERNS = [
  '/images/Xw8NSUkRYIbPyn0pP',
  'share.google/images',
  'share.google',
  'drive.google.com/open',
  'photos.app.goo.gl',
  'Xw8NSUkRYIbPyn0pP', // El ID específico que está causando problemas
  'https://share.google', // Bloquear cualquier URL que empiece así
  'http://share.google'   // También HTTP
]

// URLs de imagen por defecto para usar como fallback
export const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&q=80', // Noticias generales
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&q=80', // Periodismo
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&q=80', // Actualidad
  'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&h=600&q=80', // Política
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&q=80'  // Cultura
]

export const DEFAULT_IMAGE_URL = FALLBACK_IMAGES[0]

/**
 * Verifica si una URL es válida y accesible
 * @param url URL a verificar
 * @returns boolean indicando si la URL es válida
 */
const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    
    // Verificar protocolo
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }
    
    // Verificar dominios bloqueados
    const hostname = urlObj.hostname.toLowerCase()
    if (BLOCKED_DOMAINS.some(domain => hostname.includes(domain))) {
      return false
    }
    
    // Verificar patrones bloqueados
    if (BLOCKED_PATTERNS.some(pattern => url.includes(pattern))) {
      return false
    }
    
    // Verificar extensiones de imagen válidas
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
    const hasValidExtension = validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    )
    
    // Permitir URLs sin extensión si son de dominios conocidos
    const trustedDomains = ['unsplash.com', 'picsum.photos', 'via.placeholder.com', 'supabase.co']
    const isTrustedDomain = trustedDomains.some(domain => hostname.includes(domain))
    
    return hasValidExtension || isTrustedDomain
  } catch {
    return false
  }
}

/**
 * Valida y corrige URLs de imágenes problemáticas
 * @param url URL de imagen a validar
 * @returns URL válida o URL de fallback
 */
export function getValidImageUrl(url: string | null | undefined): string {
  // Si no hay URL, retornar imagen por defecto sin log
  if (!url || url.trim() === '') {
    return DEFAULT_IMAGE_URL
  }

  // Limpiar la URL
  const cleanUrl = url.trim()

  // Verificación inmediata para URLs de Google sharing que son problemáticas
  if (cleanUrl.includes('share.google') || 
      cleanUrl.includes('Xw8NSUkRYIbPyn0pP') ||
      cleanUrl.startsWith('https://share.google') ||
      cleanUrl.startsWith('http://share.google')) {
    console.warn(`Blocked Google sharing URL: ${cleanUrl}`)
    return getRandomFallbackImage()
  }

  // Verificación temprana de patrones bloqueados para evitar errores de Next.js
  for (const pattern of BLOCKED_PATTERNS) {
    if (cleanUrl.includes(pattern)) {
      console.warn(`Blocked invalid image URL (early check): ${cleanUrl}`)
      return getRandomFallbackImage()
    }
  }

  // Verificar si la URL es válida usando nuestra función de validación
  if (!isValidImageUrl(cleanUrl)) {
    console.warn(`Blocked invalid image URL: ${cleanUrl}`)
    
    // Seleccionar una imagen de fallback aleatoria
    return getRandomFallbackImage()
  }

  // Si la URL es válida, devolverla
  return cleanUrl
}

/**
 * Obtiene una imagen de fallback aleatoria
 */
export function getRandomFallbackImage(): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length)
  return FALLBACK_IMAGES[randomIndex]
}

/**
 * Obtiene una imagen placeholder basada en el tipo de contenido
 * @param category Categoría del artículo
 * @param width Ancho deseado (opcional)
 * @param height Alto deseado (opcional)
 * @returns URL de imagen placeholder apropiada
 */
export function getCategoryPlaceholder(
  category?: string
): string {
  const placeholders: Record<string, string> = {
    'política': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&q=80',
    'deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&q=80',
    'tecnología': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&q=80',
    'economía': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&q=80',
    'cultura': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&q=80',
    'internacional': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&q=80',
    'salud': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&q=80',
  }

  const categoryKey = category?.toLowerCase() || 'general'
  return placeholders[categoryKey] || DEFAULT_IMAGE_URL
}

/**
 * Maneja errores de carga de imágenes
 * @param event Evento de error de la imagen
 * @param fallbackUrl URL de fallback a usar
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl?: string
): void {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src
  
  console.warn(`Image failed to load: ${currentSrc}`)
  
  // Evitar loops infinitos
  if (currentSrc === DEFAULT_IMAGE_URL || FALLBACK_IMAGES.includes(currentSrc)) {
    return
  }
  
  // Usar fallback específico o imagen por defecto
  img.src = fallbackUrl || getRandomFallbackImage()
}