-- SQL SIMPLE PARA VERIFICAR SI TODO FUNCIONA
-- Copia y pega esto en Supabase Query Editor para probar

-- 1. Verificar que la tabla existe y ver su estructura
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'live_videos'
ORDER BY ordinal_position;

-- 2. Ver todos los videos existentes (si los hay)
SELECT * FROM live_videos;

-- 3. Insertar un video de prueba (opcional)
INSERT INTO live_videos (
  title, 
  youtube_url, 
  youtube_video_id, 
  description, 
  is_live, 
  is_enabled,
  thumbnail_url
) VALUES (
  'Video de Prueba - Las Informaciones',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'Este es un video de prueba para verificar que el sistema funciona',
  true,
  true,
  'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
) ON CONFLICT (id) DO NOTHING;

-- 4. Verificar que se insertó correctamente
SELECT * FROM live_videos WHERE is_enabled = true;