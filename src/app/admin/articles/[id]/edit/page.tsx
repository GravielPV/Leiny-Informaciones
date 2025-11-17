'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  category_id: string
  image_url?: string
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
    image_url: ''
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
          image_url: articleData.image_url || ''
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
      const { error } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.status,
          category_id: formData.category_id,
          image_url: formData.image_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin/articles')
    } catch (error) {
      console.error('Error updating article:', error)
      setError('Error al actualizar el artículo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-lg">Cargando artículo...</div>
        </div>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/articles" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver a artículos
          </Link>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Editar Artículo</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ingresa el título del artículo"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Extracto *
          </label>
          <textarea
            id="excerpt"
            rows={3}
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Breve descripción del artículo"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría *
          </label>
          <select
            id="category"
            required
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* URL de Imagen con validación avanzada */}
        <ImageUrlInput
          value={formData.image_url}
          onChange={(value) => setFormData({ ...formData, image_url: value })}
          label="URL de Imagen Principal"
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Escribe el contenido completo del artículo"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/articles"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}