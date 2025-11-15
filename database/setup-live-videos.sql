-- Script SQL para crear tabla de videos en vivo
-- Ejecutar en Query Editor de Supabase

-- 1. Crear tabla para gestionar videos en vivo
CREATE TABLE IF NOT EXISTS live_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  youtube_video_id VARCHAR(50) NOT NULL,
  description TEXT,
  is_live BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT false,
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_live_videos_enabled ON live_videos(is_enabled);
CREATE INDEX IF NOT EXISTS idx_live_videos_live ON live_videos(is_live);
CREATE INDEX IF NOT EXISTS idx_live_videos_created_at ON live_videos(created_at);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE live_videos ENABLE ROW LEVEL SECURITY;

-- 4. Política para que todos puedan leer videos habilitados
CREATE POLICY "Anyone can view enabled live videos"
ON live_videos FOR SELECT
TO public
USING (is_enabled = true);

-- 5. Política para que usuarios autenticados puedan gestionar videos
CREATE POLICY "Authenticated users can manage live videos"
ON live_videos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_live_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para actualizar timestamp
CREATE TRIGGER update_live_videos_updated_at_trigger
  BEFORE UPDATE ON live_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_live_videos_updated_at();

-- 8. Función para extraer video ID de YouTube URL
CREATE OR REPLACE FUNCTION extract_youtube_video_id(url TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Extraer ID de diferentes formatos de URL de YouTube
  RETURN CASE
    WHEN url ~ 'youtube\.com/watch\?v=([^&]+)' THEN
      substring(url from 'youtube\.com/watch\?v=([^&]+)')
    WHEN url ~ 'youtu\.be/([^?]+)' THEN
      substring(url from 'youtu\.be/([^?]+)')
    WHEN url ~ 'youtube\.com/embed/([^?]+)' THEN
      substring(url from 'youtube\.com/embed/([^?]+)')
    ELSE
      NULL
  END;
END;
$$ LANGUAGE plpgsql;

-- 9. Verificar que la tabla se creó correctamente
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'live_videos'
ORDER BY ordinal_position;