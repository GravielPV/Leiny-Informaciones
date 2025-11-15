# Configuración de Base de Datos - Las Informaciones con Leyni

## 🗄️ Configurar Supabase Database

### Paso 1: Acceder al Panel de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto "Las Informaciones con Leyni"

### Paso 2: Ejecutar el Script SQL

1. En el panel lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New Query"**
3. Copia y pega TODO el contenido del archivo `database/setup.sql`
4. Haz clic en **"Run"** (botón azul en la esquina inferior derecha)

### Paso 3: Verificar la Configuración

Después de ejecutar el script, deberías ver:

```
✅ Configuración completada exitosamente
✅ Total de categorías: 8
✅ Total de artículos: 1
```

### Paso 4: Verificar las Tablas

1. Ve a **"Table Editor"** en el panel lateral
2. Deberías ver estas tablas:
   - ✅ `categories` (8 categorías)
   - ✅ `articles` (1 artículo de ejemplo)

### 🔧 Si hay errores:

#### Error: "relation already exists"
- **Solución**: Esto es normal si ya existen algunas tablas. El script usa `IF NOT EXISTS`.

#### Error: "permission denied"
- **Solución**: Asegúrate de estar en el proyecto correcto y tener permisos de administrador.

#### Error: "authentication required"
- **Solución**: Verifica que las variables de entorno estén configuradas correctamente:
  ```
  NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
  NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
  ```

### 📋 Categorías Creadas

El script crea automáticamente estas categorías:

| Categoría | Color | Descripción |
|-----------|-------|-------------|
| Última Hora | Rojo | Noticias de último momento |
| Política | Azul | Noticias políticas y gubernamentales |
| Economía | Verde | Noticias económicas y financieras |
| Sociedad | Púrpura | Noticias sociales y comunitarias |
| Deportes | Naranja | Noticias deportivas |
| Cultura | Rosa | Eventos y noticias culturales |
| Internacional | Cian | Noticias internacionales |
| Opinión | Gris | Artículos de opinión y editorial |

### 🚀 Después de la Configuración

Una vez completada la configuración:

1. **Reinicia** el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. **Prueba** crear un artículo en `/admin/articles/new`

3. **Verifica** que aparezcan las categorías en el dropdown

### 🔍 Troubleshooting

Si aún tienes problemas:

1. **Verifica las variables de entorno** en `.env.local`
2. **Revisa la consola** del navegador para más detalles del error
3. **Comprueba el panel de Supabase** que las tablas se crearon correctamente
4. **Reinicia** el servidor de desarrollo

### 📞 Soporte

Si necesitas ayuda adicional, verifica:
- ✅ Proyecto de Supabase activo
- ✅ Variables de entorno correctas
- ✅ Tablas creadas en Supabase
- ✅ Conexión a internet estable