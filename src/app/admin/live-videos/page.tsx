'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Play, Square, Video, CheckCircle, Radio, Film } from 'lucide-react'
import { getAllLiveVideos, enableLiveVideo, disableAllLiveVideos, deleteLiveVideo } from '@/lib/supabase/liveVideos'
import type { LiveVideo } from '@/utils/youtubeUtils'
import { formatDate } from '@/lib/utils'
import StatCard from '@/components/admin/StatCard'

export default function LiveVideosAdminPage() {
  const [videos, setVideos] = useState<LiveVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAllLiveVideos()
      setVideos(data)
    } catch (err) {
      setError('Error al cargar los videos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnable = async (videoId: string) => {
    try {
      setSelectedVideo(videoId)
      const result = await enableLiveVideo(videoId)
      if (result.success) {
        await fetchVideos()
        alert('Video habilitado exitosamente')
      } else {
        alert(result.error || 'Error al habilitar el video')
      }
    } catch (err) {
      alert('Error inesperado al habilitar el video')
    } finally {
      setSelectedVideo(null)
    }
  }

  const handleDisableAll = async () => {
    if (!confirm('¿Estás seguro de que quieres deshabilitar todos los videos?')) {
      return
    }

    try {
      const result = await disableAllLiveVideos()
      if (result.success) {
        await fetchVideos()
        alert('Todos los videos han sido deshabilitados')
      } else {
        alert(result.error || 'Error al deshabilitar los videos')
      }
    } catch (err) {
      alert('Error inesperado al deshabilitar los videos')
    }
  }

  const handleDelete = async (videoId: string, videoTitle: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el video "${videoTitle}"?`)) {
      return
    }

    try {
      const result = await deleteLiveVideo(videoId)
      if (result.success) {
        await fetchVideos()
        alert('Video eliminado exitosamente')
      } else {
        alert(result.error || 'Error al eliminar el video')
      }
    } catch (err) {
      alert('Error inesperado al eliminar el video')
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos en Vivo</h1>
          <p className="mt-1 text-gray-600">
            Gestiona los videos y transmisiones en vivo de YouTube
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDisableAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Deshabilitar Todos
          </button>
          
          {videos.length === 0 ? (
            <a
              href="/admin/live-videos/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Video
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
              title="Debes eliminar el video existente para agregar uno nuevo"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Video
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {videos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Límite de videos alcanzado</p>
            <p>Solo se permite tener un video configurado a la vez. Para agregar uno nuevo, primero debes eliminar el actual.</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Videos Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Play className="w-12 h-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay videos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer video en vivo.
            </p>
            <div className="mt-6">
              <a
                href="/admin/live-videos/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Video
              </a>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {videos.map((video) => (
              <li key={video.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-24 rounded-md object-cover"
                        src={video.thumbnail_url || '/placeholder-image.jpg'}
                        alt={video.title}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg'
                        }}
                      />
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </h3>
                        
                        {/* Status Badges */}
                        <div className="flex gap-1">
                          {video.is_enabled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Habilitado
                            </span>
                          )}
                          
                          {video.is_live ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              🔴 En Vivo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              📹 Video
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {video.description && (
                        <p className="text-sm text-gray-500 truncate mb-1">
                          {video.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Creado: {formatDate(video.created_at)}</span>
                        {video.updated_at !== video.created_at && (
                          <span>Actualizado: {formatDate(video.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Preview Link */}
                    {video.is_enabled && (
                      <a
                        href={`/live/${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver video"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}

                    {/* Enable/Disable */}
                    <button
                      onClick={() => video.is_enabled ? handleDisableAll() : handleEnable(video.id)}
                      disabled={selectedVideo === video.id}
                      className={`p-1 rounded ${
                        video.is_enabled
                          ? 'text-gray-600 hover:text-gray-800'
                          : 'text-green-600 hover:text-green-800'
                      } ${selectedVideo === video.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={video.is_enabled ? 'Deshabilitar' : 'Habilitar'}
                    >
                      {selectedVideo === video.id ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      ) : video.is_enabled ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <a
                      href={`/admin/live-videos/${video.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(video.id, video.title)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stats */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Videos"
            value={videos.length}
            icon={Video}
            color="blue"
          />
          <StatCard
            title="Habilitados"
            value={videos.filter(v => v.is_enabled).length}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="En Vivo"
            value={videos.filter(v => v.is_live && v.is_enabled).length}
            icon={Radio}
            color="purple"
          />
          <StatCard
            title="Videos Grabados"
            value={videos.filter(v => !v.is_live && v.is_enabled).length}
            icon={Film}
            color="yellow"
          />
        </div>
      )}
    </div>
  )
}