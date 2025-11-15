-- SQL para corregir múltiples videos habilitados
-- Solo el más reciente debe estar habilitado

-- 1. Deshabilitar todos los videos
UPDATE live_videos 
SET is_enabled = false;

-- 2. Habilitar solo el más reciente (puedes cambiar el ID por el que prefieras)
UPDATE live_videos 
SET is_enabled = true 
WHERE id = '8a5fd9ad-b602-4c02-b842-811dfba4307a';

-- Si prefieres el otro video, usa esta línea en su lugar:
-- UPDATE live_videos SET is_enabled = true WHERE id = '3ba1bbd4-7f03-4c40-8446-d8f9a297a1de';

-- 3. Verificar que solo uno está habilitado
SELECT 
  id,
  title, 
  is_live,
  is_enabled,
  created_at
FROM live_videos 
ORDER BY created_at DESC;