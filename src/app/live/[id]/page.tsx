import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getYouTubeEmbedUrl } from '@/utils/youtubeUtils'
import LiveVideoShare from '@/components/LiveVideoShare'
import type { LiveVideo } from '@/utils/youtubeUtils'

interface LiveVideoPageProps {
  params: Promise<{
    id: string
  }>
}

async function getLiveVideo(id: string): Promise<LiveVideo | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('live_videos')
      .select('*')
      .eq('id', id)
      .eq('is_enabled', true)
      .single()

    if (error) {
      console.error('Error fetching live video:', error)
      return null
    }

    return data as LiveVideo
  } catch (error) {
    console.error('Error connecting to live_videos table:', error)
    return null
  }
}

export default async function LiveVideoPage({ params }: LiveVideoPageProps) {
  const { id } = await params
  const video = await getLiveVideo(id)

  if (!video) {
    notFound()
  }

  const embedUrl = getYouTubeEmbedUrl(video.youtube_video_id)
  const isLive = video.is_live
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/live/${video.id}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del video */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
              isLive ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {isLive ? '🔴 En Vivo' : '📹 Video'}
            </div>
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Transmisión en vivo</span>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {video.title}
          </h1>
          
          {video.description && (
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
          <div className="relative aspect-video">
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Información del Video
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                  <dd className="text-sm text-gray-900">
                    {isLive ? 'Transmisión en vivo' : 'Video grabado'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de publicación:</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(video.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                {video.updated_at !== video.created_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última actualización:</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(video.updated_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <LiveVideoShare 
                title={video.title} 
                url={currentUrl}
              />
            </div>
          </div>
        </div>

        {/* Volver al inicio */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}