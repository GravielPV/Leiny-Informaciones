'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Calendar } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import Link from 'next/link'

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

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance')
  const [totalResults, setTotalResults] = useState(0)

  const supabase = createClient()

  // Cargar categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      
      if (data) {
        setCategories(data)
      }
    }
    
    fetchCategories()
  }, [supabase])

  const performSearch = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      let queryBuilder = supabase
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

      // Búsqueda por texto en título, excerpt y contenido
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
      )

      // Filtrar por categoría si está seleccionada
      if (selectedCategory) {
        // Nota: Esta es una aproximación, en producción necesitarías una búsqueda más sofisticada
        const { data: allResults } = await queryBuilder
        
        const filteredResults = allResults?.filter(article => {
          if (Array.isArray(article.categories)) {
            return article.categories.some((cat: Category) => cat.id === selectedCategory)
          }
          return (article.categories as Category)?.id === selectedCategory
        }) || []

        setResults(filteredResults as Article[])
        setTotalResults(filteredResults.length)
      } else {
        // Ordenar resultados
        if (sortBy === 'date') {
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
        }

        const { data, error } = await queryBuilder.limit(20)
        
        if (error) {
          console.error('Error en búsqueda:', error)
          setResults([])
          setTotalResults(0)
        } else {
          setResults(data as Article[] || [])
          setTotalResults(data?.length || 0)
        }
      }
    } catch (error) {
      console.error('Error en búsqueda:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [query, selectedCategory, sortBy, supabase])

  // Ejecutar búsqueda cuando cambien los parámetros
  useEffect(() => {
    if (query.trim()) {
      performSearch()
    } else {
      setResults([])
      setTotalResults(0)
    }
  }, [query, selectedCategory, sortBy, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
    
    // Actualizar URL
    const newParams = new URLSearchParams()
    if (query.trim()) newParams.set('q', query.trim())
    if (selectedCategory) newParams.set('categoria', selectedCategory)
    if (sortBy !== 'relevance') newParams.set('orden', sortBy)
    
    window.history.pushState({}, '', `/buscar?${newParams.toString()}`)
  }

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

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800">$1</mark>')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Buscar Noticias
            </h1>
            <p className="text-lg text-gray-600">
              Encuentra la información que necesitas en nuestro archivo de noticias
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar noticias, temas, palabras clave..."
                className="block w-full pl-10 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-blue-400">
                  {loading ? 'Buscando...' : 'Buscar'}
                </div>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Más relevantes</option>
                <option value="date">Más recientes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        {query && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {loading ? 'Buscando...' : (
                totalResults > 0 
                  ? `${totalResults} resultado${totalResults !== 1 ? 's' : ''} para "${query}"`
                  : `Sin resultados para "${query}"`
              )}
            </h2>
            {totalResults > 0 && (
              <p className="text-gray-600 text-sm">
                {selectedCategory && (
                  <span>En categoría: <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong> • </span>
                )}
                Ordenado por: <strong>{sortBy === 'date' ? 'Fecha' : 'Relevancia'}</strong>
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => (
              <article key={article.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <a href={`/articulos/${article.id}`} className="block h-full">
                  <div className="aspect-video relative bg-gray-200 overflow-hidden">
                    <OptimizedImage
                      src={article.image_url || ''}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-600 uppercase tracking-wide">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm font-medium group-hover:bg-blue-200 transition-colors">
                        {getCategoryName(article.categories)}
                      </span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    
                    <h3 
                      className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(article.title, query)
                      }}
                    />
                    
                    <p 
                      className="text-sm text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          article.excerpt?.substring(0, 120) + (article.excerpt && article.excerpt.length > 120 ? '...' : ''),
                          query
                        )
                      }}
                    />
                    
                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800 transition-colors inline-flex items-center">
                      Leer artículo completo
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No se encontraron resultados
            </h3>
            <div className="text-gray-600 mb-8 max-w-md mx-auto">
              <p className="mb-4">No hay artículos que coincidan con tu búsqueda &ldquo;{query}&rdquo;.</p>
              <div className="text-sm">
                <p className="font-medium mb-2">Sugerencias:</p>
                <ul className="text-left space-y-1">
                  <li>• Verifica la ortografía</li>
                  <li>• Prueba con palabras más generales</li>
                  <li>• Busca en todas las categorías</li>
                  <li>• Intenta con sinónimos</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Ver Todas las Noticias
              </Link>
              <button 
                onClick={() => {setQuery(''); setSelectedCategory(''); setResults([]); setTotalResults(0)}}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Nueva Búsqueda
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Busca en nuestro archivo de noticias
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Introduce palabras clave en el buscador para encontrar artículos, noticias y temas específicos.
            </p>
            
            {/* Popular Searches */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-gray-900 mb-4">Búsquedas populares:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['política', 'economía', 'deportes', 'internacional', 'sociedad'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}