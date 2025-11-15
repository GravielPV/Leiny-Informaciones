// Archivo temporal para probar el sistema sin tabla en Supabase
// Crear un video de prueba para verificar que el sistema funciona

import type { LiveVideo } from '@/utils/youtubeUtils'

// Video de prueba para mostrar mientras aplicas el SQL
export const TEST_VIDEO: LiveVideo = {
  id: '8a5fd9ad-b602-4c02-b842-811dfba4307a',
  title: 'Transmisión de Prueba - Las Informaciones con Leyni',
  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  youtube_video_id: 'dQw4w9WgXcQ',
  description: 'Esta es una transmisión de prueba para verificar que el sistema funciona correctamente.',
  is_live: true,
  is_enabled: true,
  thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: 'test-user'
}

// Función temporal que devuelve el video de prueba
export async function getTestLiveVideo(): Promise<LiveVideo | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Devolver video de prueba si está habilitado
  return TEST_VIDEO.is_enabled ? TEST_VIDEO : null
}