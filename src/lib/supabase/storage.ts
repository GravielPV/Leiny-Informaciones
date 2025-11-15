import { createClient } from '@/lib/supabase/client'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Sube una imagen al bucket de Supabase Storage
 */
export async function uploadImage(file: File, folder: string = 'articles'): Promise<UploadResult> {
  try {
    const supabase = createClient()

    // Validar archivo
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen (JPG, PNG, GIF, WebP)'
      }
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'El archivo no puede ser mayor a 5MB'
      }
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${folder}/${timestamp}-${randomStr}.${fileExtension}`

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: 'Error al subir el archivo: ' + error.message
      }
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Error inesperado al subir el archivo'
    }
  }
}

/**
 * Elimina una imagen del bucket de Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Extraer el path desde la URL pública
    const urlParts = filePath.split('/storage/v1/object/public/images/')
    if (urlParts.length < 2) {
      return false
    }
    
    const path = urlParts[1]
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Obtiene información sobre el uso del storage
 */
export async function getStorageInfo() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase.storage
      .from('images')
      .list('articles', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('Error getting storage info:', error)
      return null
    }

    const totalSize = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
    const fileCount = data.length

    return {
      fileCount,
      totalSize,
      files: data
    }
  } catch (error) {
    console.error('Storage info error:', error)
    return null
  }
}