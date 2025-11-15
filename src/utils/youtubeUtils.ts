/**
 * Utilidades para manejar videos de YouTube
 */

// Tipos para TypeScript
export interface LiveVideo {
  id: string
  title: string
  youtube_url: string
  youtube_video_id: string
  description?: string
  is_live: boolean
  is_enabled: boolean
  thumbnail_url?: string
  created_at: string
  updated_at: string
  created_by?: string
}

/**
 * Extrae el ID del video de YouTube de una URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /youtube\.com\/watch\?v=([^&\n?#]+)/,
    // youtu.be/VIDEO_ID
    /youtu\.be\/([^&\n?#]+)/,
    // youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^&\n?#]+)/,
    // youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([^&\n?#]+)/,
    // youtube.com/live/VIDEO_ID
    /youtube\.com\/live\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Valida si una URL de YouTube es válida
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

/**
 * Genera URL del thumbnail de YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg', 
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`
}

/**
 * Genera URL de embed de YouTube
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = false, mute: boolean = false): string {
  const params = new URLSearchParams()
  
  if (autoplay) params.set('autoplay', '1')
  if (mute) params.set('mute', '1')
  params.set('rel', '0') // No mostrar videos relacionados
  params.set('modestbranding', '1') // Logo de YouTube más discreto
  
  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? '?' + queryString : ''}`
}

/**
 * Detecta si un video es probablemente un stream en vivo
 */
export function isLikelyLiveStream(title: string, description?: string): boolean {
  const liveKeywords = [
    'live', 'en vivo', 'directo', 'streaming', 'transmisión',
    'ahora', 'actual', 'tiempo real', 'breaking', 'última hora'
  ]
  
  const text = `${title} ${description || ''}`.toLowerCase()
  return liveKeywords.some(keyword => text.includes(keyword))
}

/**
 * Formatea duración de video (si está disponible)
 */
export function formatVideoDuration(duration: string): string {
  // YouTube API devuelve duración en formato ISO 8601 (PT4M13S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

/**
 * Limpia y normaliza URL de YouTube
 */
export function normalizeYouTubeUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return url
  
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Obtiene información básica del video desde la URL
 */
export async function getVideoInfo(url: string): Promise<{videoId: string, thumbnailUrl: string} | null> {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null
  
  return {
    videoId,
    thumbnailUrl: getYouTubeThumbnail(videoId)
  }
}