import Link from 'next/link'
import { Home, Search, TrendingUp } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-[150px] sm:text-[200px] font-black text-blue-600 leading-none">
            404
          </h1>
          <div className="h-2 w-32 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Página No Encontrada
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <p className="text-gray-500">
            Es posible que el enlace esté roto o que la página haya sido eliminada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Volver al Inicio</span>
          </Link>
          
          <Link
            href="/buscar"
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-6 py-3 rounded-sm font-medium transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Buscar Noticias</span>
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Secciones Populares
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'Última Hora', slug: 'ultima-hora' },
              { name: 'Política', slug: 'politica' },
              { name: 'Deportes', slug: 'deportes' },
              { name: 'Economía', slug: 'economia' },
              { name: 'Sociedad', slug: 'sociedad' },
              { name: 'Opinión', slug: 'opinion' }
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-sm text-sm font-medium transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            ¿Necesitas ayuda? 
            <Link href="/contacto" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
