import { createClient } from '@/lib/supabase/client'
import type { LiveVideo } from '@/utils/youtubeUtils'
import { extractYouTubeVideoId, getYouTubeThumbnail, normalizeYouTubeUrl } from '@/utils/youtubeUtils'

/**
 * Obtiene el video en vivo actualmente habilitado
 */
export async function getCurrentLiveVideo(): Promise<LiveVideo | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('live_videos')
      .select('*')
      .eq('is_enabled', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Solo loguear si no es un error de conexión (PGRST116 es "no rows returned", que es normal)
      if (error.code !== 'PGRST116') {
        console.warn('Error fetching live video:', error.message)
      }
      return null
    }

    return data as LiveVideo
  } catch (error) {
    // Silenciar errores de conexión en el cliente
    return null
  }
}

/**
 * Obtiene todos los videos para el admin
 */
export async function getAllLiveVideos(): Promise<LiveVideo[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('live_videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching live videos:', error)
      return []
    }

    return data as LiveVideo[] || []
  } catch (error) {
    console.error('Error connecting to live_videos table:', error)
    return []
  }
}

/**
 * Crea un nuevo video en vivo
 */
export async function createLiveVideo(videoData: {
  title: string
  youtube_url: string
  description?: string
  is_live?: boolean
  is_enabled?: boolean
}): Promise<{ success: boolean; data?: LiveVideo; error?: string }> {
  try {
    const supabase = createClient()
    
    // Validar URL de YouTube
    const videoId = extractYouTubeVideoId(videoData.youtube_url)
    if (!videoId) {
      return { success: false, error: 'URL de YouTube no válida' }
    }

    // Normalizar URL y generar thumbnail
    const normalizedUrl = normalizeYouTubeUrl(videoData.youtube_url)
    const thumbnailUrl = getYouTubeThumbnail(videoId)

    const { data, error } = await supabase
      .from('live_videos')
      .insert({
        title: videoData.title,
        youtube_url: normalizedUrl,
        youtube_video_id: videoId,
        description: videoData.description || '',
        is_live: videoData.is_live || false,
        is_enabled: videoData.is_enabled || false,
        thumbnail_url: thumbnailUrl
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating live video:', error)
      return { success: false, error: 'Error al crear el video: ' + error.message }
    }

    return { success: true, data: data as LiveVideo }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al crear el video' }
  }
}

/**
 * Actualiza un video existente
 */
export async function updateLiveVideo(
  id: string, 
  updates: Partial<Omit<LiveVideo, 'id' | 'created_at' | 'updated_at' | 'created_by'>>
): Promise<{ success: boolean; data?: LiveVideo; error?: string }> {
  try {
    const supabase = createClient()

    // Si se actualiza la URL, validar y normalizar
    if (updates.youtube_url) {
      const videoId = extractYouTubeVideoId(updates.youtube_url)
      if (!videoId) {
        return { success: false, error: 'URL de YouTube no válida' }
      }
      
      updates.youtube_url = normalizeYouTubeUrl(updates.youtube_url)
      updates.youtube_video_id = videoId
      updates.thumbnail_url = getYouTubeThumbnail(videoId)
    }

    const { data, error } = await supabase
      .from('live_videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating live video:', error)
      return { success: false, error: 'Error al actualizar el video: ' + error.message }
    }

    return { success: true, data: data as LiveVideo }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al actualizar el video' }
  }
}

/**
 * Elimina un video
 */
export async function deleteLiveVideo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('live_videos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting live video:', error)
      return { success: false, error: 'Error al eliminar el video: ' + error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al eliminar el video' }
  }
}

/**
 * Habilita un video (deshabilitando todos los demás)
 */
export async function enableLiveVideo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Primero deshabilitar todos los videos
    await supabase
      .from('live_videos')
      .update({ is_enabled: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy condition para afectar a todos

    // Luego habilitar el seleccionado
    const { error } = await supabase
      .from('live_videos')
      .update({ is_enabled: true })
      .eq('id', id)

    if (error) {
      console.error('Error enabling live video:', error)
      return { success: false, error: 'Error al habilitar el video: ' + error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al habilitar el video' }
  }
}

/**
 * Deshabilita todos los videos
 */
export async function disableAllLiveVideos(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('live_videos')
      .update({ is_enabled: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy condition para afectar a todos

    if (error) {
      console.error('Error disabling live videos:', error)
      return { success: false, error: 'Error al deshabilitar videos: ' + error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado al deshabilitar videos' }
  }
}