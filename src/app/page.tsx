import { createClient } from '@/lib/supabase/server'
import NewsletterForm from '@/components/NewsletterForm'
import OptimizedImage from '@/components/OptimizedImage'
import WeatherWidgetWrapper from '@/components/WeatherWidgetWrapper'
import { getCategorySlug } from '@/utils/categoryUtils'

// Definir tipos para TypeScript
interface Category {
  id: string
  name: string
  color?: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image_url?: string
  created_at: string
  author_id?: string
  categories?: Category | Category[]
}

// Constantes de paginación
const ARTICLES_PER_PAGE = 12

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE

  // Obtener el total de artículos publicados
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const totalPages = Math.ceil((totalArticles || 0) / ARTICLES_PER_PAGE)

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
      author_id,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1) as { data: Article[] | null }

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

  return (
    <div className="min-h-screen bg-gray-50">
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
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-sm w-fit group-hover:bg-blue-700 transition-colors">
                            {Array.isArray(featuredArticle.categories) 
                              ? featuredArticle.categories[0]?.name || 'General'
                              : featuredArticle.categories?.name || 'General'
                            }
                          </span>
                          <span>{formatDate(featuredArticle.created_at)}</span>
                          <span>Por Redacción</span>
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
                          <div className="flex flex-wrap items-center space-x-4 text-gray-500 text-sm">
                            <span>Compartir:</span>
                            <a href="#" className="hover:text-blue-600 transition-colors">Facebook</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">WhatsApp</a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                )}

                {/* Secondary News Grid - Responsive */}
                {articles && articles.length > 1 && (
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b-2 border-blue-600 pb-2">
                      Otras Noticias
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {articles.slice(1).map((article) => (
                        <article key={article.id} className="group bg-white border border-gray-200 hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 rounded-sm overflow-hidden cursor-pointer transform hover:-translate-y-1">
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
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm w-fit group-hover:bg-blue-200 transition-colors">
                                  {Array.isArray(article.categories) 
                                    ? article.categories[0]?.name || 'General'
                                    : article.categories?.name || 'General'
                                  }
                                </span>
                                <span className="text-xs">{formatDate(article.created_at)}</span>
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
                <div className="bg-white border-l-4 border-l-blue-600 border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 border-b border-blue-200 pb-2">
                    Editorial
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                    En tiempos de cambios constantes, el periodismo responsable se convierte en el pilar fundamental de una sociedad informada.
                  </p>
                  <p className="text-xs text-gray-600 font-medium">- Leyni Pérez, Directora Editorial</p>
                </div>

                {/* Weather Widget */}
                <div>
                  <WeatherWidgetWrapper />
                </div>

                {/* Categories with real counts */}
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

                {/* Newsletter */}
                <NewsletterForm variant="sidebar" />
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
