'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { getAllLiveVideos, updateLiveVideo, deleteLiveVideo } from '@/lib/supabase/liveVideos'
import { extractYouTubeVideoId, getYouTubeThumbnail } from '@/utils/youtubeUtils'
import type { LiveVideo } from '@/utils/youtubeUtils'

export default function EditLiveVideoPage() {
  const router = useRouter()
  const params = useParams()
  const videoId = params.id as string
  
  const [video, setVideo] = useState<LiveVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{
    videoId: string
    thumbnail: string
    isLive: boolean
  } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    is_live: false,
    is_enabled: false
  })

  useEffect(() => {
    if (videoId) {
      loadVideo()
    }
  }, [videoId])

  const loadVideo = async () => {
    try {
      const videos = await getAllLiveVideos()
      const foundVideo = videos.find(v => v.id === videoId)
      
      if (!foundVideo) {
        setError('Video no encontrado')
        return
      }

      setVideo(foundVideo)
      setFormData({
        title: foundVideo.title,
        youtube_url: foundVideo.youtube_url,
        description: foundVideo.description || '',
        is_live: foundVideo.is_live,
        is_enabled: foundVideo.is_enabled
      })

      // Set initial preview
      if (foundVideo.youtube_video_id) {
        setPreview({
          videoId: foundVideo.youtube_video_id,
          thumbnail: foundVideo.thumbnail_url || getYouTubeThumbnail(foundVideo.youtube_video_id),
          isLive: foundVideo.is_live
        })
      }

    } catch (err) {
      setError('Error al cargar el video')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, youtube_url: url }))
    setError('')

    if (!url.trim()) {
      setPreview(null)
      return
    }

    const videoId = extractYouTubeVideoId(url)
    if (!videoId) {
      setError('URL de YouTube no válida')
      setPreview(null)
      return
    }

    try {
      const thumbnail = getYouTubeThumbnail(videoId)
      
      setPreview({
        videoId,
        thumbnail,
        isLive: formData.is_live // Usar el estado actual del formulario
      })
    } catch (err) {
      console.error('Error checking video:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.youtube_url.trim()) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    if (!preview) {
      setError('Por favor ingresa una URL de YouTube válida')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const result = await updateLiveVideo(videoId, {
        title: formData.title,
        youtube_url: formData.youtube_url,
        description: formData.description,
        is_live: formData.is_live,
        is_enabled: formData.is_enabled
      })
      
      if (result.success) {
        alert('Video actualizado exitosamente')
        router.push('/admin/live-videos')
      } else {
        setError(result.error || 'Error al actualizar el video')
      }
    } catch (err) {
      setError('Error inesperado al actualizar el video')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!video || !confirm(`¿Estás seguro de que quieres eliminar el video "${video.title}"?`)) {
      return
    }

    try {
      const result = await deleteLiveVideo(video.id)
      
      if (result.success) {
        alert('Video eliminado exitosamente')
        router.push('/admin/live-videos')
      } else {
        alert(result.error || 'Error al eliminar el video')
      }
    } catch (err) {
      alert('Error inesperado al eliminar el video')
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando video...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Video no encontrado</h1>
        <p className="mt-2 text-gray-600">El video que buscas no existe o fue eliminado.</p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/admin/live-videos')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver a Videos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Video</h1>
            <p className="mt-1 text-gray-600">
              Modifica la información del video en vivo
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* YouTube URL */}
          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700">
              URL de YouTube *
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Ingresa la URL del video de YouTube o transmisión en vivo
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Vista Previa del Video</h3>
              <div className="flex items-start gap-4">
                <img
                  src={preview.thumbnail}
                  alt="Thumbnail del video"
                  className="w-32 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      preview.isLive 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {preview.isLive ? '🔴 En Vivo' : '📹 Video'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Video ID: {preview.videoId}
                  </p>
                  {preview.isLive && (
                    <p className="text-sm text-green-600 font-medium">
                      ✅ Transmisión en vivo detectada automáticamente
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título del video o transmisión"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción opcional del video..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Live Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del Video
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_live: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Es una transmisión en vivo
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_enabled: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Habilitar (mostrar botón &quot;En Vivo&quot;)
                </span>
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Solo un video puede estar habilitado a la vez. Si habilitas este video, se deshabilitarán automáticamente los demás.
            </p>
          </div>

          {/* Video Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Información del Video</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Creado:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(video.created_at).toLocaleString('es-ES')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Actualizado:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(video.updated_at).toLocaleString('es-ES')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Estado actual:</span>
                <span className={`ml-2 font-medium ${
                  video.is_enabled ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {video.is_enabled ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="ml-2 text-gray-900">
                  {video.is_live ? 'Transmisión en vivo' : 'Video grabado'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSaving || !preview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}