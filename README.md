# Las Informaciones con Leyni - Portal de Noticias

Un portal de noticias moderno y profesional desarrollado con Next.js, TypeScript y Supabase.

## 🚀 Características

- **Portal de Noticias Completo**: Sistema de gestión de artículos y categorías
- **Dashboard Administrativo**: Panel de control profesional con estadísticas y widgets
- **Autenticación**: Sistema de usuarios con roles (administrador, publicista)
- **Widget del Clima**: Información meteorológica en tiempo real para RD
- **Responsive Design**: Diseño adaptable para todos los dispositivos
- **SEO Optimizado**: Metadata dinámica y estructura optimizada para buscadores
- **Sistema de Imágenes**: Optimización automática y fallbacks inteligentes
- **Linting y TypeScript**: Código limpio y tipado para mantenibilidad

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Code Quality**: ESLint, TypeScript strict mode
- **Deployment Ready**: Optimizado para producción

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel administrativo
│   ├── api/               # API routes
│   ├── articulos/         # Páginas de artículos
│   ├── auth/              # Autenticación
│   ├── buscar/            # Sistema de búsqueda
│   └── categoria/         # Páginas de categorías
├── components/            # Componentes React
│   ├── admin/            # Componentes del admin
│   └── ui/               # Componentes base
├── lib/                  # Utilidades y configuración
└── utils/                # Funciones auxiliares
```

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd pagina-para-leiny
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar .env.example a .env.local y configurar
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **Scripts disponibles**
```bash
# Desarrollo
npm run dev                # Ejecutar en modo desarrollo

# Producción
npm run build             # Construir para producción
npm run start             # Iniciar servidor de producción
npm run prod:build        # Build completo con validaciones
npm run prod:start        # Build y start completo

# Calidad de código
npm run lint              # Verificar código con ESLint
npm run lint:fix          # Corregir errores de ESLint automáticamente
npm run type-check        # Verificar tipos de TypeScript
```

5. **Configurar variables de entorno**
Copia `.env.example` a `.env.local` y configura:
```bash

## 📱 URLs Principales

- **Portal Público**: `/`
- **Búsqueda**: `/buscar`
- **Categorías**: `/categoria/[slug]`
- **Artículos**: `/articulos/[id]`
- **Admin Login**: `/auth/login`
- **Dashboard**: `/admin`

## 🔐 Sistema de Usuarios

- **Administrador**: Acceso completo al sistema
- **Publicista**: Crear y editar artículos (sin eliminar artículos publicados)

## 📊 Características del Dashboard

- **Estadísticas**: Contadores de artículos, usuarios y visualizaciones
- **Widget del Clima**: Información meteorológica de Bajos de Haina, RD
- **Gestión de Artículos**: CRUD completo con editor enriquecido
- **Gestión de Usuarios**: Control de accesos y roles
- **Categorías**: Administración de secciones de noticias

## 🌐 Deployment

El proyecto está optimizado para producción con:
- Compresión automática de imágenes
- Eliminación de console.logs en producción
- Headers de seguridad configurados
- Caché optimizado
- Bundle size minimizado

Listo para deployar en Vercel, Netlify o cualquier plataforma que soporte Next.js.

## 📄 Licencia

Proyecto desarrollado para Las Informaciones con Leyni © 2025
