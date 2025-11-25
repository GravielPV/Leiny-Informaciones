'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { ArrowLeft, Save, Eye, Calendar, Tag, FileText, Image as ImageIcon, Layout } from 'lucide-react'
import { updateArticle } from '../../actions'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  category_id: string
  image_url?: string
  published_at?: string
}

interface Category {
  id: string
  name: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
    category_id: '',
    image_url: '',
    published_at: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch article
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', params.id)
          .single()

        if (articleError) throw articleError

        setArticle(articleData)
        setFormData({
          title: articleData.title,
          content: articleData.content,
          excerpt: articleData.excerpt,
          status: articleData.status,
          category_id: articleData.category_id,
          image_url: articleData.image_url || '',
          published_at: articleData.published_at ? new Date(articleData.published_at).toISOString().slice(0, 16) : ''
        })

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await updateArticle(params.id as string, {
        ...formData,
        original_published_at: article?.published_at || null
      })

      router.push('/admin/articles')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating article:', error)
      setError(error.message || 'Error al actualizar el artículo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-lg text-red-600">Artículo no encontrado</div>
          <Link href="/admin/articles" className="text-blue-600 hover:text-blue-800">
            Volver a artículos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/articles" 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Volver a artículos"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Artículo</h1>
            <p className="text-sm text-gray-500">Gestiona el contenido y la publicación</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {article.status === 'published' && (
            <Link
              href={`/articulos/${article.id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver en vivo
            </Link>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Content Card */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="sr-only">Título</label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full border-0 border-b-2 border-gray-100 px-0 py-2 text-3xl font-bold text-gray-900 placeholder-gray-300 focus:border-blue-500 focus:ring-0 transition-colors"
                  placeholder="Escribe el título aquí..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Contenido
                </label>
                <div className="prose-editor">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Escribe el contenido completo del artículo..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt Card */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
            <label htmlFor="excerpt" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Layout className="w-4 h-4" />
              Extracto / Resumen
            </label>
            <textarea
              id="excerpt"
              rows={3}
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Breve descripción que aparecerá en las tarjetas de noticias..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Este texto se mostrará en la página principal y en los resultados de búsqueda.
            </p>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Publishing Card */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Publicación
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Publicación
                </label>
                <input
                  type="datetime-local"
                  id="publishedAt"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.published_at 
                    ? 'El artículo se publicará en esta fecha.' 
                    : 'Se publicará inmediatamente.'}
                </p>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Organización
            </h3>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Imagen Destacada
            </h3>
            
            <ImageUrlInput
              value={formData.image_url}
              onChange={(value) => setFormData({ ...formData, image_url: value })}
              label=""
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}