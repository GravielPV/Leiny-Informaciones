import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = SITE_CONFIG.url

  // Obtener todos los artículos publicados
  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, published_at')
    .eq('status', 'published')
    .or(`published_at.lte.${new Date().toISOString()},published_at.is.null`)
    .order('published_at', { ascending: false, nullsFirst: false })

  // Obtener todas las categorías únicas
  const { data: categories } = await supabase
    .from('categories')
    .select('name')

  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Rutas de artículos
  const articleRoutes: MetadataRoute.Sitemap = articles?.map((article) => ({
    url: `${baseUrl}/articulos/${article.id}`,
    lastModified: new Date(article.published_at || article.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  })) || []

  // Rutas de categorías
  const categoryRoutes: MetadataRoute.Sitemap = categories?.map((category) => {
    const slug = category.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')

    return {
      url: `${baseUrl}/categoria/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }
  }) || []

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes]
}
