'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import RichTextEditor from '@/components/admin/RichTextEditor'

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Artículo</h1>
        <p className="mt-2 text-sm text-gray-600">
          Crea un nuevo artículo para el sitio web
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow px-6 py-6 sm:rounded-lg">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Título del artículo"
                />
              </div>
            </div>

            {/* Extracto */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Extracto
              </label>
              <div className="mt-1">
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Breve descripción del artículo..."
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Un resumen breve que aparecerá en las listas de artículos
              </p>
            </div>

            {/* URL de Imagen con validación avanzada */}
            <ImageUrlInput
              value={imageUrl}
              onChange={setImageUrl}
              label="URL de Imagen Principal"
              placeholder="https://ejemplo.com/imagen.jpg"
            />

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Escribe aquí el contenido completo del artículo..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Contenido principal del artículo con formato rico.
              </p>
            </div>

            {/* Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="draft"
                      type="radio"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="draft" className="ml-3 block text-sm font-medium text-gray-700">
                      Borrador
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="published"
                      type="radio"
                      value="published"
                      checked={status === 'published'}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="published" className="ml-3 block text-sm font-medium text-gray-700">
                      Publicado
                    </label>
                  </div>
                </div>
              </div>

              {/* Fecha de Publicación */}
              <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Publicación (Programar)
                </label>
                <input
                  type="datetime-local"
                  id="publishedAt"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deja en blanco para publicar inmediatamente. Si seleccionas una fecha futura, el artículo se programará.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear Artículo'}
          </button>
        </div>
      </form>
    </div>
  )
}