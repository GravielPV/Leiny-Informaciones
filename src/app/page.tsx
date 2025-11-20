import { createClient } from '@/lib/supabase/server'
import NewsletterForm from '@/components/NewsletterForm'
import OptimizedImage from '@/components/OptimizedImage'
import WeatherWidgetWrapper from '@/components/WeatherWidgetWrapper'
import ShareButtons from '@/components/ShareButtons'
import MostReadWidget from '@/components/MostReadWidget'
import FadeInSection from '@/components/FadeInSection'
import AdSenseAd from '@/components/AdSenseAd'
import DynamicAd from '@/components/DynamicAd'
import { getCategorySlug } from '@/utils/categoryUtils'
import { isNewArticle } from '@/utils/articleUtils'
import { TrendingUp, Flame } from 'lucide-react'
import { Metadata } from 'next'
import { Database } from '@/lib/types/database'
import { SITE_CONFIG, PAGINATION, ADSENSE_CONFIG } from '@/lib/constants'

// Metadata para homepage
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Noticias Actualizadas de República Dominicana`,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  openGraph: {
    title: `${SITE_CONFIG.name} - Noticias de República Dominicana`,
    description: 'Portal líder de noticias. Información confiable y actualizada las 24 horas.',
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Portal de Noticias`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: 'Portal líder de noticias en República Dominicana',
    images: [SITE_CONFIG.ogImage],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

// Definir tipos para TypeScript
type Category = Pick<Database['public']['Tables']['categories']['Row'], 'id' | 'name' | 'color'>

interface Article extends Pick<Database['public']['Tables']['articles']['Row'], 'id' | 'title' | 'content' | 'excerpt' | 'image_url' | 'created_at' | 'published_at' | 'author_id'> {
  categories: Category | Category[] | null
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const offset = (currentPage - 1) * PAGINATION.ARTICLES_PER_PAGE

  // Obtener el total de artículos publicados
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .or(`published_at.lte.${new Date().toISOString()},published_at.is.null`)

  const totalPages = Math.ceil((totalArticles || 0) / PAGINATION.ARTICLES_PER_PAGE)

  // Obtener artículos publicados de la base de datos con paginación
  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      content,
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
    .range(offset, offset + PAGINATION.ARTICLES_PER_PAGE - 1) as { data: Article[] | null }

  // Obtener artículo destacado (más reciente)
  const featuredArticle = articles && articles.length > 0 ? articles[0] : null

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

  // Structured Data para homepage
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lasinformacionesconleyni.com'
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Las Informaciones con Leyni',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo2.jpg`,
    },
    description: 'Portal líder de noticias en República Dominicana',
    sameAs: [
      'https://www.facebook.com/lasinformacionesconleyni',
      'https://twitter.com/lasinformacionesld',
      'https://www.instagram.com/lasinformacionesconleyni',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Editorial Office',
      email: 'contacto@lasinformacionesconleyni.com',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        
        {/* Breaking News Banner - Responsive */}
        {articles && articles.length > 0 && (
          <div className="bg-red-600 text-white py-2 border-b border-red-700 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="bg-white text-red-600 px-2 sm:px-3 py-1 text-xs font-bold rounded uppercase tracking-widest flex-shrink-0">
                  Última Hora
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="animate-scroll">
                    <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {articles.slice(0, 3).map((article, index) => (
                        `${article.title}${index < 2 ? '  —  ' : ''}`
                      )).join('')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Responsive Layout */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Main News Section */}
              <div className="xl:col-span-3">
                {/* Principal Article - Responsive */}
                {featuredArticle && (
                  <FadeInSection direction="up">
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b-2 border-blue-600 pb-2">
                        Noticia Principal
                      </h2>
                    
                    <article className="group bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                      <a href={`/articulos/${featuredArticle.id}`} className="block">
                        <div className="aspect-video bg-gray-300 relative overflow-hidden image-container">
                          <OptimizedImage 
                            src={featuredArticle.image_url || ''} 
                            alt={featuredArticle.title}
                            fill
                            className="article-image group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                            priority
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </div>
                      </a>
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 text-xs text-gray-600 uppercase tracking-wide">
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-sm w-fit group-hover:bg-blue-700 transition-colors">
                              {Array.isArray(featuredArticle.categories) 
                                ? featuredArticle.categories[0]?.name || 'General'
                                : featuredArticle.categories?.name || 'General'
                              }
                            </span>
                            {isNewArticle(featuredArticle.published_at || featuredArticle.created_at) && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-sm font-bold flex items-center space-x-1 animate-pulse">
                                <Flame className="w-3 h-3" />
                                <span>NUEVO</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-gray-600">
                            <span>{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                          </div>
                        </div>
                        <a href={`/articulos/${featuredArticle.id}`} className="block">
                          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                            {featuredArticle.title}
                          </h1>
                          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-800 transition-colors">
                            {featuredArticle.excerpt}
                          </p>
                        </a>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-4 border-t border-gray-200">
                          <a href={`/articulos/${featuredArticle.id}`} className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2 text-sm font-medium hover:bg-blue-700 transition-colors text-center group-hover:bg-blue-700 flex items-center justify-center">
                            LEER ARTÍCULO COMPLETO
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                          <ShareButtons articleId={featuredArticle.id} title={featuredArticle.title} />
                        </div>
                      </div>
                    </article>
                  </div>
                  </FadeInSection>
                )}

                {/* Ad after featured article */}
                <FadeInSection direction="up" delay={100}>
                  <div className="mb-6 sm:mb-8">
                    <DynamicAd 
                      slotKey="HOME_HEADER"
                      adFormat="horizontal"
                      className="bg-gray-100 border border-gray-200 p-2 rounded-sm"
                    />
                  </div>
                </FadeInSection>

                {/* Secondary News Grid - Responsive */}
                {articles && articles.length > 1 && (
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b-2 border-blue-600 pb-2">
                      Otras Noticias
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {articles.slice(1).map((article, index) => (
                        <FadeInSection key={article.id} direction="up" delay={Math.min(index * 100, 400)}>
                          <article className="group bg-white border border-gray-200 hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 rounded-sm overflow-hidden cursor-pointer transform hover:-translate-y-1">
                          <a href={`/articulos/${article.id}`} className="block h-full">
                            <div className="aspect-video bg-gray-200 relative overflow-hidden image-container">
                              <OptimizedImage 
                                src={article.image_url || ''} 
                                alt={article.title}
                                fill
                                className="article-image group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 text-xs text-gray-600 uppercase tracking-wide space-y-1 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm w-fit group-hover:bg-blue-200 transition-colors">
                                    {Array.isArray(article.categories) 
                                      ? article.categories[0]?.name || 'General'
                                      : article.categories?.name || 'General'
                                    }
                                  </span>
                                  {isNewArticle(article.published_at || article.created_at) && (
                                    <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-sm text-xs font-bold">
                                      NUEVO
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs">{formatDate(article.published_at || article.created_at)}</span>
                                </div>
                              </div>
                              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                {article.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3 group-hover:text-gray-700 transition-colors">
                                {article.excerpt?.substring(0, 120)}
                                {article.excerpt && article.excerpt.length > 120 && '...'}
                              </p>
                              <span className="text-xs text-gray-900 font-medium group-hover:text-blue-600 transition-colors flex items-center">
                                Leer más 
                                <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </a>
                        </article>
                        </FadeInSection>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Info de página */}
                      <div className="text-sm text-gray-600">
                        Mostrando página <span className="font-bold text-gray-900">{currentPage}</span> de <span className="font-bold text-gray-900">{totalPages}</span>
                      </div>

                      {/* Controles de paginación */}
                      <div className="flex items-center space-x-2">
                        {/* Botón anterior */}
                        {currentPage > 1 ? (
                          <a
                            href={`/?page=${currentPage - 1}`}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">Anterior</span>
                          </a>
                        ) : (
                          <span className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-sm cursor-not-allowed flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">Anterior</span>
                          </span>
                        )}

                        {/* Números de página */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // Mostrar siempre primera, última y páginas cercanas a la actual
                              if (page === 1 || page === totalPages) return true
                              if (page >= currentPage - 1 && page <= currentPage + 1) return true
                              return false
                            })
                            .map((page, index, array) => (
                              <div key={page} className="flex items-center">
                                {/* Agregar puntos suspensivos si hay salto */}
                                {index > 0 && page - array[index - 1] > 1 && (
                                  <span className="px-2 text-gray-400">...</span>
                                )}
                                
                                {page === currentPage ? (
                                  <span className="px-4 py-2 bg-blue-600 text-white font-bold rounded-sm">
                                    {page}
                                  </span>
                                ) : (
                                  <a
                                    href={`/?page=${page}`}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                                  >
                                    {page}
                                  </a>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Botón siguiente */}
                        {currentPage < totalPages ? (
                          <a
                            href={`/?page=${currentPage + 1}`}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors flex items-center space-x-1"
                          >
                            <span className="hidden sm:inline">Siguiente</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        ) : (
                          <span className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-sm cursor-not-allowed flex items-center space-x-1">
                            <span className="hidden sm:inline">Siguiente</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Responsive */}
              <div className="xl:col-span-1 space-y-6 sm:space-y-8">
                {/* Editor's Note */}
                <FadeInSection direction="left" delay={100}>
                  <div className="bg-white border-l-4 border-l-blue-600 border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 border-b border-blue-200 pb-2">
                      Editorial
                    </h3>
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-blue-600">LJ</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          En tiempos de cambios constantes, el periodismo responsable se convierte en el pilar fundamental de una sociedad informada.
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">- Leiny Jimenez, Directora Editorial</p>
                  </div>
                </FadeInSection>

                {/* Sidebar Ad */}
                <FadeInSection direction="left" delay={150}>
                  <div>
                    <DynamicAd 
                      slotKey="HOME_SIDEBAR"
                      adFormat="vertical"
                      className="bg-gray-100 border border-gray-200 p-2 rounded-sm"
                    />
                  </div>
                </FadeInSection>

                {/* Weather Widget */}
                <FadeInSection direction="left" delay={200}>
                  <div>
                    <WeatherWidgetWrapper />
                  </div>
                </FadeInSection>

                {/* Most Read Articles */}
                <FadeInSection direction="left" delay={300}>
                  <MostReadWidget 
                    articles={(articles || []).slice(0, 5).map(article => ({
                      ...article,
                      image_url: article.image_url || undefined,
                      excerpt: article.excerpt || '',
                      categories: Array.isArray(article.categories) 
                        ? article.categories 
                        : article.categories 
                          ? [article.categories] 
                          : []
                    }))} 
                  />
                </FadeInSection>

                {/* Categories with real counts */}
                <FadeInSection direction="left" delay={400}>
                  <div className="bg-white border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 border-b border-blue-200 pb-2">
                      Secciones
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {[
                        'Última Hora', 'Política', 'Economía', 'Sociedad', 
                        'Deportes', 'Cultura', 'Internacional', 'Opinión'
                      ].map((categoryName) => {
                        const count = articles?.filter(a => 
                          Array.isArray(a.categories) 
                            ? a.categories.some((cat: Category) => cat.name === categoryName)
                            : a.categories?.name === categoryName
                        ).length || 0
                        
                        return (
                          <a
                            key={categoryName}
                            href={`/categoria/${getCategorySlug(categoryName)}`}
                            className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0 rounded-sm"
                          >
                            <span className="font-medium">{categoryName}</span>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-sm">{count}</span>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </FadeInSection>

                {/* Newsletter */}
                <FadeInSection direction="left" delay={100}>
                  <NewsletterForm variant="sidebar" />
                </FadeInSection>
              </div>
            </div>
          ) : (
            // Estado vacío cuando no hay artículos - Responsive
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📰</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Próximamente Contenido Exclusivo
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Estamos preparando contenido de calidad para mantenerte informado. 
                Regresa pronto para las últimas noticias.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}
