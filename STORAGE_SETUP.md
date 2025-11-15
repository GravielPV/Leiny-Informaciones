# Configuración de Supabase Storage

## Configuración Requerida en Supabase

Para habilitar la carga de archivos, necesitas configurar Supabase Storage:

### 1. Crear el Bucket de Imágenes

1. Ve a **Storage** en tu panel de Supabase
2. Crea un nuevo bucket llamado `images`
3. Marca la opción **"Public bucket"** para permitir acceso público a las imágenes

### 2. Ejecutar Políticas de Seguridad

Ejecuta el script SQL que se encuentra en `database/setup-storage.sql` en el **Query Editor** de Supabase:

```sql
-- El archivo setup-storage.sql contiene todas las políticas necesarias
```

### 3. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` contenga:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## Funcionalidades Implementadas

### Componente ImageUrlInput

- **Pestañas duales**: URL manual vs. Carga de archivo
- **Validación en tiempo real**: Detecta URLs problemáticas (Google Share, etc.)
- **Vista previa automática**: Muestra la imagen antes de guardar
- **Galería de sugerencias**: Imágenes predeterminadas de alta calidad
- **Carga con drag & drop**: Arrastra archivos directamente
- **Progreso visual**: Barra de progreso durante la carga

### Seguridad y Validaciones

#### Frontend:
- Validación de tipos de archivo (JPG, PNG, GIF, WebP)
- Límite de tamaño: 5MB máximo
- Validación de URLs problemáticas
- Sanitización automática de nombres de archivo

#### Backend (Supabase):
- Bucket público para lectura
- Solo usuarios autenticados pueden subir
- Restricción a carpeta `articles/`
- Validación de extensiones de archivo
- Políticas RLS (Row Level Security)

## Estructura de Almacenamiento

```
supabase/storage/images/
├── articles/
│   ├── 1700000000-abc123.jpg
│   ├── 1700000001-def456.png
│   └── ...
└── (futuras carpetas como avatars/, thumbnails/, etc.)
```

## Nomenclatura de Archivos

Formato automático: `timestamp-randomstring.extension`

Ejemplo: `1700000000-k2j4h5n8m.jpg`

## Integración con Artículos

1. **Crear Artículo**: 
   - Pestaña "Subir Archivo" para imágenes locales
   - Pestaña "URL de Imagen" para enlaces externos
   - Vista previa automática

2. **Editar Artículo**:
   - Misma funcionalidad dual
   - Conserva imagen existente como vista previa

3. **Gestión de URLs**:
   - URLs de Supabase Storage se tratan como válidas
   - Fallback automático si falla la carga
   - Sistema de imágenes sugeridas

## Limitaciones Conocidas

- **Tamaño máximo**: 5MB por archivo
- **Formatos soportados**: JPG, JPEG, PNG, GIF, WebP
- **URLs problemáticas**: Google Drive/Photos/Share no funcionan directamente
- **Dependencia de autenticación**: Se requiere usuario logueado para subir

## Troubleshooting

### Error: "bucket_id violation"
- Verifica que el bucket 'images' existe
- Ejecuta las políticas SQL

### Error: "row-level security policy violation"
- Usuario no está autenticado
- Políticas no están configuradas correctamente

### Error: "file too large"
- Archivo excede 5MB
- Implementar compresión de imagen si es necesario

### Imagen no se muestra después de subir
- Verificar que el bucket es público
- Verificar URL generada
- Comprobar políticas de lectura

## Próximas Mejoras

- [ ] Compresión automática de imágenes
- [ ] Múltiples tamaños (thumbnails)
- [ ] Editor de imágenes integrado
- [ ] Gestión de imágenes existentes
- [ ] Analytics de uso de storage