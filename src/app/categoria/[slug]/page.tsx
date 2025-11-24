import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import OptimizedImage from '@/components/OptimizedImage'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import { slugCategoryMap } from '@/utils/categoryUtils'
import { ArticleSummary, Category } from '@/lib/types/app'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

// Mapeo de slugs a nombres de categorías - ahora usar el import
const categoryMap = slugCategoryMap

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams
  
  // Decode the URL slug to handle special characters like accents
  const decodedSlug = decodeURIComponent(slug)
  const categoryName = categoryMap[slug] || categoryMap[decodedSlug] || slug
  
  return {
    title: `${categoryName} - Las Informaciones con Leyni`,
    description: `Últimas noticias y artículos sobre ${categoryName}. Mantente informado con Las Informaciones con Leyni.`,
    keywords: [`noticias ${categoryName}`, 'información', 'actualidad', categoryName, 'República Dominicana'],
    openGraph: {
      title: `${categoryName} - Las Informaciones con Leyni`,
      description: `Últimas noticias y artículos sobre ${categoryName}`,
      type: 'website',
      siteName: 'Las Informaciones con Leyni',
      locale: 'es_DO',
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} - Las Informaciones con Leyni`,
      description: `Últimas noticias y artículos sobre ${categoryName}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const supabase = await createClient()

  // Decode the URL slug to handle special characters like accents
  const decodedSlug = decodeURIComponent(slug)
  
  // Obtener el nombre de la categoría desde el slug (try both original and decoded)
  const categoryName = categoryMap[slug] || categoryMap[decodedSlug]
  
  if (!categoryName) {
    console.error(`Category not found for slug: "${slug}" (decoded: "${decodedSlug}"). Available slugs: ${Object.keys(categoryMap).join(', ')}`)
    notFound()
  }

  // Obtener artículos de la categoría específica
  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      slug,
      image_url,
      created_at,
      published_at,
      author_id,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('status', 'published')
    .or(`published_at.lte.${new Date().toISOString()},published_at.is.null`)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(20) as { data: ArticleSummary[] | null }

  // Filtrar artículos por categoría
  const filteredArticles = articles?.filter(article => {
    if (Array.isArray(article.categories)) {
      return article.categories.some((cat: Category) => cat.name === categoryName)
    }
    return article.categories?.name === categoryName
  }) || []

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Hace algunos minutos'
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }

  const getCategoryName = (categories: Category | Category[] | undefined) => {
    if (Array.isArray(categories)) {
      return categories[0]?.name || 'General'
    }
    return categories?.name || 'General'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        items={[
          {
            label: categoryName
          }
        ]}
      />

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Category Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {categoryName}
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {filteredArticles.length > 0 
                ? `Últimas noticias y actualizaciones en ${categoryName.toLowerCase()}`
                : `Próximamente contenido en ${categoryName.toLowerCase()}`
              }
            </p>
            <div className="mt-3 text-sm text-gray-500">
              {filteredArticles.length} artículo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArticles.length > 0 ? (
          <>
            {/* Featured Article (First one) */}
            {filteredArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
                  Artículo Destacado
                </h2>
                
                <article className="group bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                  <div className="md:flex md:h-[400px]">
                    {/* Image Container - 40% width on desktop */}
                    <a href={`/articulos/${filteredArticles[0].id}`} className="block md:w-2/5 md:flex-shrink-0">
                      <div className="h-64 md:h-full bg-gray-300 relative overflow-hidden image-container">
                        <OptimizedImage 
                          src={filteredArticles[0].image_url || ''}
                          alt={filteredArticles[0].title}
                          fill
                          className="article-image group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      </div>
                    </a>
                    
                    {/* Content Container - 60% width on desktop */}
                    <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                      <div className="flex items-center space-x-4 mb-4 text-xs text-gray-600 uppercase tracking-wide">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-sm font-medium group-hover:bg-blue-700 transition-colors">
                          {getCategoryName(filteredArticles[0].categories)}
                        </span>
                        <span>{formatDate(filteredArticles[0].published_at || filteredArticles[0].created_at)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Por Redacción</span>
                      </div>
                      <a href={`/articulos/${filteredArticles[0].id}`} className="block">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                          {filteredArticles[0].title}
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed group-hover:text-gray-800 transition-colors line-clamp-3">
                          {filteredArticles[0].excerpt}
                        </p>
                      </a>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <a href={`/articulos/${filteredArticles[0].id}`} className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors rounded-sm group-hover:bg-blue-700 flex items-center">
                          LEER ARTÍCULO
                          <svg className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Other Articles Grid */}
            {filteredArticles.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-blue-600 pb-2">
                  Más en {categoryName}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.slice(1).map((article) => (
                    <article key={article.id} className="group bg-white border border-gray-200 hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 rounded-sm overflow-hidden cursor-pointer transform hover:-translate-y-1">
                      <a href={`/articulos/${article.id}`} className="block h-full">
                        <div className="aspect-video bg-gray-200 relative overflow-hidden image-container">
                          <OptimizedImage 
                            src={article.image_url || ''}
                            alt={article.title}
                            fill
                            className="article-image group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3 text-xs text-gray-600 uppercase tracking-wide">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm font-medium group-hover:bg-blue-200 transition-colors">
                              {getCategoryName(article.categories)}
                            </span>
                            <span>{formatDate(article.published_at || article.created_at)}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {article.excerpt?.substring(0, 120)}
                            {article.excerpt && article.excerpt.length > 120 && '...'}
                          </p>
                          <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800 transition-colors flex items-center">
                            Leer más 
                            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Load More Button (Future functionality) */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                ¿Buscas más noticias de {categoryName.toLowerCase()}?
              </p>
              <Link href="/" className="bg-gray-800 text-white px-6 py-3 text-sm font-medium hover:bg-gray-900 transition-colors rounded-sm">
                VER TODAS LAS NOTICIAS
              </Link>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No hay contenido disponible
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Aún no hemos publicado contenido en la sección de {categoryName.toLowerCase()}. 
              Regresa pronto para nuevas actualizaciones.
            </p>
            <div className="flex justify-center">
              <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm font-medium transition-colors">
                Ver Todas las Noticias
              </Link>
            </div>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Explorar Otras Secciones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryMap).filter(([slug]) => slug !== resolvedParams.slug).slice(0, 6).map(([slug, name]) => (
              <a
                key={slug}
                href={`/categoria/${slug}`}
                className="bg-white border border-gray-200 p-4 text-center hover:shadow-md hover:border-blue-300 transition-all rounded-sm"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{name}</div>
                <div className="text-xs text-gray-500">Explorar sección</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}