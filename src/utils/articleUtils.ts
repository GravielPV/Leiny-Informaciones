/**
 * Utilidades para manejo de artículos
 */

/**
 * Calcula el tiempo estimado de lectura basado en el contenido
 * @param content Contenido del artículo
 * @returns Tiempo estimado en minutos
 */
export function calculateReadingTime(content: string): number {
  // Promedio de lectura: 200 palabras por minuto en español
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return Math.max(1, minutes) // Mínimo 1 minuto
}

/**
 * Determina si un artículo es "nuevo" (publicado en las últimas 24 horas)
 * @param createdAt Fecha de creación del artículo
 * @returns boolean
 */
export function isNewArticle(createdAt: string): boolean {
  const articleDate = new Date(createdAt)
  const now = new Date()
  const hoursDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60)
  return hoursDiff <= 24
}

/**
 * Determina si un artículo es "trending" (publicado en las últimas 48 horas)
 * @param createdAt Fecha de creación del artículo
 * @returns boolean
 */
export function isTrendingArticle(createdAt: string): boolean {
  const articleDate = new Date(createdAt)
  const now = new Date()
  const hoursDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60)
  return hoursDiff <= 48
}

/**
 * Genera la URL para compartir en Facebook
 * @param articleUrl URL completa del artículo
 * @returns URL de compartir en Facebook
 */
export function getFacebookShareUrl(articleUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
}

/**
 * Genera la URL para compartir en Twitter/X
 * @param articleUrl URL completa del artículo
 * @param title Título del artículo
 * @returns URL de compartir en Twitter
 */
export function getTwitterShareUrl(articleUrl: string, title: string): string {
  const text = `${title} - Las Informaciones con Leyni`
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(text)}`
}

/**
 * Genera la URL para compartir en WhatsApp
 * @param articleUrl URL completa del artículo
 * @param title Título del artículo
 * @returns URL de compartir en WhatsApp
 */
export function getWhatsAppShareUrl(articleUrl: string, title: string): string {
  const text = `${title} - ${articleUrl}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Extrae tags/etiquetas del contenido o genera basadas en categoría
 * @param category Nombre de la categoría
 * @param title Título del artículo
 * @returns Array de tags
 */
export function generateTags(category: string, title: string): string[] {
  const tags: string[] = []
  
  // Tag de categoría
  tags.push(category)
  
  // Tags basadas en palabras clave del título
  const keywords = title.toLowerCase().split(' ')
  const stopWords = ['el', 'la', 'los', 'las', 'de', 'del', 'en', 'con', 'por', 'para', 'un', 'una', 'y', 'o']
  
  keywords.forEach(word => {
    if (word.length > 4 && !stopWords.includes(word)) {
      const cleanWord = word.replace(/[^a-záéíóúñü]/gi, '')
      if (cleanWord && !tags.includes(cleanWord)) {
        tags.push(cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1))
      }
    }
  })
  
  return tags.slice(0, 5) // Máximo 5 tags
}
