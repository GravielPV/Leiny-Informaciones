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
              <li><a href="/ultimas-noticias" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Últimas Noticias</a></li>
              <li><a href="/politica" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Política</a></li>
              <li><a href="/economia" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Economía</a></li>
              <li><a href="/sociedad" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Sociedad</a></li>
              <li><a href="/deportes" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Deportes</a></li>
              <li><a href="/opinion" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Opinión</a></li>
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
                <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="bg-blue-400 hover:bg-blue-500 p-2 rounded transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.894 3.708 13.743 3.708 12.446s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
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
              <span className="text-center">Desarrollo web profesional</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-center">Registro Nacional de Medios: DOM-2024-001</span>
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