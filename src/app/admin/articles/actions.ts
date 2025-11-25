'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface UpdateArticleData {
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  category_id: string
  image_url?: string | null
  published_at?: string | null
  original_published_at?: string | null
}

export async function updateArticle(id: string, data: UpdateArticleData) {
  const supabase = await createClient()

  // Validar category_id
  if (!data.category_id || data.category_id.trim() === '') {
    throw new Error('La categoría es obligatoria')
  }

  const updateData = {
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    status: data.status,
    category_id: data.category_id,
    image_url: data.image_url || null,
    updated_at: new Date().toISOString(),
    published_at: data.published_at 
      ? new Date(data.published_at).toISOString() 
      : (data.status === 'published' && !data.original_published_at 
          ? new Date().toISOString() 
          : data.original_published_at)
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating article:', error)
    throw new Error('Error al actualizar el artículo: ' + error.message)
  }

  // Revalidar rutas críticas
  revalidatePath('/admin/articles')
  revalidatePath('/')
  revalidatePath('/articulos/[id]', 'page') // Intento genérico
  
  // Revalidar layout global para asegurar que menús y listas se actualicen
  revalidatePath('/', 'layout')

  return { success: true }
}
