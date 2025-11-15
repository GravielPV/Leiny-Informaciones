/**
 * Utilidades para manejo de categorías
 */

// Mapeo de nombres de categorías a slugs
export const categorySlugMap: { [key: string]: string } = {
  'Última Hora': 'ultima-hora',
  'Política': 'politica',
  'Economía': 'economia', 
  'Sociedad': 'sociedad',
  'Deportes': 'deportes',
  'Cultura': 'cultura',
  'Internacional': 'internacional',
  'Mundo': 'internacional',
  'Opinión': 'opinion',
  'General': 'general',
  'Noticias': 'general',
  'Actualidad': 'general'
}

// Mapeo inverso de slugs a nombres
export const slugCategoryMap: { [key: string]: string } = {
  'ultima-hora': 'Última Hora',
  'politica': 'Política',
  'economia': 'Economía',
  'sociedad': 'Sociedad',
  'deportes': 'Deportes',
  'cultura': 'Cultura',
  'internacional': 'Internacional',
  'mundo': 'Internacional',
  'opinion': 'Opinión',
  'opinión': 'Opinión',
  'general': 'General',
  'noticias': 'General',
  'actualidad': 'General'
}

/**
 * Convierte un nombre de categoría a slug válido
 */
export function getCategorySlug(categoryName: string): string {
  return categorySlugMap[categoryName] || categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

/**
 * Convierte un slug a nombre de categoría
 */
export function getCategoryName(slug: string): string {
  return slugCategoryMap[slug] || slug
}

/**
 * Obtiene todas las categorías disponibles
 */
export function getAllCategories(): Array<{name: string, slug: string}> {
  return Object.entries(categorySlugMap).map(([name, slug]) => ({
    name,
    slug
  })).filter((category, index, self) => 
    // Remover duplicados basados en el slug
    self.findIndex(c => c.slug === category.slug) === index
  )
}

/**
 * Valida si un slug de categoría existe
 */
export function isValidCategorySlug(slug: string): boolean {
  return Object.keys(slugCategoryMap).includes(slug)
}