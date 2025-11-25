import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ArticleActions from './ArticleActions'
import StatusBadge from '@/components/admin/StatusBadge'
import StatCard from '@/components/admin/StatCard'
import ArticleSearch from '@/components/admin/ArticleSearch'
import { Database } from '@/lib/types/database'
import { formatDate } from '@/lib/utils'
import { FileText, CheckCircle, Edit } from 'lucide-react'

type Article = Pick<Database['public']['Tables']['articles']['Row'], 'id' | 'title' | 'excerpt' | 'status' | 'created_at' | 'updated_at'> & {
  categories: Pick<Database['public']['Tables']['categories']['Row'], 'id' | 'name'> | null
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params.query || ''

  let supabaseQuery = supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      status,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  const { data: articles, error } = await supabaseQuery

  if (error) {
    console.error('Error fetching articles:', error)
  }

  // Hacer type conversion segura
  const typedArticles = (articles || []) as unknown as Article[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Artículos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra todos los artículos de Las Informaciones con Leyni
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ➕ Nuevo Artículo
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          title="Total de Artículos"
          value={typedArticles?.length || 0}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Publicados"
          value={typedArticles?.filter(a => a.status === 'published').length || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Borradores"
          value={typedArticles?.filter(a => a.status === 'draft').length || 0}
          icon={Edit}
          color="yellow"
        />
      </div>

      {/* Search Bar */}
      <div className="mt-8">
        <ArticleSearch />
      </div>

      {/* Articles List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {typedArticles && typedArticles.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {typedArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {article.title}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {article.excerpt?.substring(0, 100)}
                                {article.excerpt && article.excerpt.length > 100 && '...'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {Array.isArray(article.categories) 
                              ? (article.categories[0] as { name: string })?.name || 'Sin categoría'
                              : article.categories?.name || 'Sin categoría'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(article.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ArticleActions 
                            articleId={article.id} 
                            articleTitle={article.title} 
                            status={article.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium mb-2">No hay artículos</h3>
                    <p className="text-sm mb-6">Comienza creando tu primer artículo.</p>
                    <Link
                      href="/admin/articles/new"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Crear Primer Artículo
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}