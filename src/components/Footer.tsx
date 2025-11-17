import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Company Info - Responsive */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <Image 
                src="/logo2.jpg" 
                alt="Las Informaciones con Leyni Logo" 
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded flex-shrink-0"
              />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">Las Informaciones con Leyni</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              Medio de comunicación comprometido con el periodismo independiente y responsable. 
              Informando a la República Dominicana con veracidad, transparencia y profesionalismo.
            </p>
            <div className="text-xs sm:text-sm text-gray-400 border-l-4 border-l-blue-600 pl-4 space-y-1 sm:space-y-2">
              <p>📍 Santo Domingo, República Dominicana</p>
              <p>📞 +1 (809) 555-0123</p>
              <p>✉️ <span className="text-blue-400">info@informacionesleyni.com</span></p>
              <p>🌐 <span className="text-blue-400">www.informacionesleyni.com</span></p>
            </div>
          </div>

          {/* Quick Links - Responsive */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-400">Secciones</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="/categoria/ultima-hora" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Últimas Noticias</a></li>
              <li><a href="/categoria/politica" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Política</a></li>
              <li><a href="/categoria/economia" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Economía</a></li>
              <li><a href="/categoria/sociedad" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Sociedad</a></li>
              <li><a href="/categoria/deportes" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Deportes</a></li>
              <li><a href="/categoria/opinion" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Opinión</a></li>
            </ul>
          </div>

          {/* Legal & Services - Responsive */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-400">Información Legal</h4>
            <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
              <li><a href="/aviso-legal" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Aviso Legal</a></li>
              <li><a href="/politica-privacidad" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Política de Privacidad</a></li>
              <li><a href="/terminos-uso" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Términos de Uso</a></li>
              <li><a href="/codigo-etico" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Código Ético</a></li>
              <li><a href="/contacto" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Contacto</a></li>
            </ul>

            {/* Social Media - Responsive */}
            <div>
              <h5 className="font-medium mb-2 sm:mb-3 text-blue-400 text-sm sm:text-base">Síguenos</h5>
              <div className="flex space-x-2 sm:space-x-3">
                <a 
                  href="https://www.facebook.com/cristileyni2020/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/50"
                  aria-label="Síguenos en Facebook"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/lasinformacionesconleyni/?hl=es" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-pink-500/50"
                  aria-label="Síguenos en Instagram"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer - Responsive */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Las Informaciones con Leyni. Todos los derechos reservados.
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
              <span className="text-center">Página creada por <a href="https://gravielpv.github.io/Portafolio--GabyDev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">GabyDev</a></span>
              <span className="hidden sm:inline">•</span>
              <a href="/admin" className="text-gray-600 hover:text-gray-400 transition-colors">
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}