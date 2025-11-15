/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes optimizada para producción
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**'
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 horas para producción
    dangerouslyAllowSVG: false, // Más seguro para producción
    unoptimized: false // Asegurar optimización en producción
  },
  
  // Configuración de headers para SEO y seguridad
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Configuración de compilación para producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  },
  
  // Optimización de rendimiento
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Configuración experimental para mejor rendimiento
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig