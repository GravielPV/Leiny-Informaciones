import { createClient } from '@/lib/supabase/server'
import { getUserWithRole } from '@/lib/auth'
import Link from 'next/link'
import WeatherWidget from '@/components/admin/WeatherWidgetDynamic'
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus,
  Edit,
  Clock
} from 'lucide-react'

// Componente para las cards de estadísticas
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  color = 'blue'
}: {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50', 
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50'
  }

  const changeClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 ${colorClasses[color].split(' ')[2]} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </div>
  )
}

// Componente para artículos recientes
function RecentArticleCard({ article }: { 
  article: {
    id: string
    title: string
    created_at: string
    status: string
  }
}) {
  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {article.title}
          </h4>
          <div className="mt-1 flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[article.status as keyof typeof statusColors]}`}>
              {article.status === 'published' ? 'Publicado' : 
               article.status === 'draft' ? 'Borrador' : 'Archivado'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Link
          href={`/admin/articles/${article.id}/edit`}
          className="ml-3 text-blue-600 hover:text-blue-800"
        >
          <Edit className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const user = await getUserWithRole()
  const supabase = await createClient()
  
  // Fechas para calcular cambios
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // Obtener estadísticas totales
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })

  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: draftArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  // Artículos del mes pasado para comparar
  const { count: articlesLastMonth } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .lt('created_at', oneMonthAgo.toISOString())

  // Artículos de la semana pasada para comparar
  const { count: publishedLastWeek } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .lt('created_at', oneWeekAgo.toISOString())

  // Calcular porcentajes de cambio
  const totalChange = articlesLastMonth && articlesLastMonth > 0 
    ? Math.round(((totalArticles || 0) - articlesLastMonth) / articlesLastMonth * 100)
    : 0

  const publishedChange = publishedLastWeek && publishedLastWeek > 0
    ? Math.round(((publishedArticles || 0) - publishedLastWeek) / publishedLastWeek * 100)
    : 0

  // Artículos recientes
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, created_at, status')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Simular vistas del mes (esto debería venir de una tabla de analytics real)
  // Por ahora usamos un número basado en artículos publicados
  const monthlyViews = (publishedArticles || 0) * 150 // Promedio de 150 vistas por artículo
  const formattedViews = monthlyViews >= 1000 
    ? `${(monthlyViews / 1000).toFixed(1)}k` 
    : monthlyViews.toString()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {user?.email?.split('@')[0]}
            </h1>
            <p className="mt-2 text-gray-600">
              Panel de control de Las Informaciones con Leyni
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Artículo
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Artículos"
          value={totalArticles || 0}
          icon={FileText}
          change={totalChange !== 0 ? `${totalChange > 0 ? '+' : ''}${totalChange}% este mes` : 'Sin cambios este mes'}
          changeType={totalChange > 0 ? 'positive' : totalChange < 0 ? 'negative' : 'neutral'}
          color="blue"
        />
        
        <StatCard
          title="Artículos Publicados"
          value={publishedArticles || 0}
          icon={Eye}
          change={publishedChange !== 0 ? `${publishedChange > 0 ? '+' : ''}${publishedChange}% esta semana` : 'Sin cambios esta semana'}
          changeType={publishedChange > 0 ? 'positive' : publishedChange < 0 ? 'negative' : 'neutral'}
          color="green"
        />
        
        <StatCard
          title="Borradores"
          value={draftArticles || 0}
          icon={Clock}
          change={`${draftArticles || 0} pendiente${(draftArticles || 0) !== 1 ? 's' : ''}`}
          changeType="neutral"
          color="yellow"
        />
        
        <StatCard
          title="Vistas del Mes"
          value={formattedViews}
          icon={TrendingUp}
          change={`~${Math.round((publishedArticles || 0) * 150)} vistas estimadas`}
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Artículos Recientes
                </h3>
                <Link 
                  href="/admin/articles"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentArticles && recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <RecentArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay artículos aún</p>
                  <Link
                    href="/admin/articles/new"
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Crear primer artículo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/admin/articles/new"
                className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 mr-3 text-gray-400" />
                Crear Artículo
              </Link>
              
              <Link
                href="/admin/users"
                className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                Gestionar Usuarios
              </Link>
              
              <Link
                href="/"
                target="_blank"
                className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-5 w-5 mr-3 text-gray-400" />
                Ver Sitio Web
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de datos</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Conectado
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último backup</span>
                  <span className="text-xs text-gray-500">
                    Hace 2 horas
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Versión</span>
                  <span className="text-xs text-gray-500">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <WeatherWidget />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Sistema</span>
                  <p className="text-gray-600 mt-1">Panel administrativo iniciado</p>
                  <p className="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}