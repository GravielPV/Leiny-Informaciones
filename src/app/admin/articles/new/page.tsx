'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { ArrowLeft, Save, Calendar, Tag, FileText, Image as ImageIcon, Layout } from 'lucide-react'

interface Category {
  id: string
  name: string
}

export default function NewArticlePage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [publishedAt, setPublishedAt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const router = useRouter()
  const supabase = createClient()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      const { error: insertError } = await supabase
        .from('articles')
        .insert({
          title,
          excerpt,
          content,
          slug,
          category_id: categoryId || null,
          status,
          published_at: publishedAt ? new Date(publishedAt).toISOString() : (status === 'published' ? new Date().toISOString() : null),
          image_url: imageUrl || null,
          author_id: session.user.id,
        })

      if (insertError) {
        setError(insertError.message)
      } else {
        router.push('/admin/articles')
      }
    } catch {
      setError('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Artículo</h1>
            <p className="text-sm text-gray-500">Crea y publica nuevo contenido</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Artículo'}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    content={content}
                    onChange={setContent}
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
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
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
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {publishedAt 
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
              value={imageUrl}
              onChange={setImageUrl}
              label=""
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}