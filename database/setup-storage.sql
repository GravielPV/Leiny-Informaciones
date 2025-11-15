-- Script SQL para configurar Supabase Storage para carga de imágenes
-- Ejecutar estos comandos en el Query Editor de Supabase

-- 1. Crear el bucket 'images' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir acceso público a las imágenes (lectura)
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 3. Permitir a usuarios autenticados subir imágenes
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'images' 
    AND (storage.foldername(name))[1] = 'articles'
    AND (LOWER(storage.extension(name)) = 'jpg' 
         OR LOWER(storage.extension(name)) = 'jpeg'
         OR LOWER(storage.extension(name)) = 'png' 
         OR LOWER(storage.extension(name)) = 'gif'
         OR LOWER(storage.extension(name)) = 'webp')
);

-- 4. Permitir a usuarios autenticados actualizar sus propias imágenes
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 5. Permitir a usuarios autenticados eliminar sus propias imágenes
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- 6. Configurar límites de tamaño (opcional - esto se maneja en el cliente)
-- Nota: Los límites de tamaño se validan en el frontend por seguridad

-- 7. Verificar configuración del bucket
SELECT * FROM storage.buckets WHERE id = 'images';

-- 8. Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';