import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Uso | Las Informaciones con Leyni',
  description: 'Términos y condiciones de uso del sitio web Las Informaciones con Leyni',
}

export default function TerminosUsoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos de Uso</h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-blue max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar <strong>Las Informaciones con Leyni</strong>, usted acepta estar sujeto a 
              estos términos de uso, todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno 
              de estos términos, no debe usar este sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso del Sitio</h2>
            <p className="text-gray-700 mb-4">
              Usted se compromete a utilizar este sitio web solo para fines legales y de manera que no infrinja 
              los derechos de terceros o restrinja o inhiba el uso del sitio por parte de otros usuarios.
            </p>
            <p className="text-gray-700 mb-4">
              Está prohibido:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Usar el sitio de manera que cause daño o interrupciones</li>
              <li>Intentar acceder de manera no autorizada al sitio o sus sistemas</li>
              <li>Transmitir material ilegal, ofensivo o inapropiado</li>
              <li>Hacerse pasar por otra persona o entidad</li>
              <li>Recopilar información de otros usuarios sin su consentimiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contenido del Usuario</h2>
            <p className="text-gray-700 mb-4">
              Si el sitio permite comentarios u otras formas de contenido generado por usuarios, usted es 
              responsable de todo el contenido que publique. Nos reservamos el derecho de eliminar cualquier 
              contenido que consideremos inapropiado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido de este sitio, incluyendo texto, imágenes, gráficos, logos y software, está 
              protegido por derechos de autor y otras leyes de propiedad intelectual.
            </p>
            <p className="text-gray-700 mb-4">
              Puede ver y descargar contenido solo para uso personal y no comercial, siempre que mantenga 
              todos los avisos de derechos de autor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              <strong>Las Informaciones con Leyni</strong> no garantiza que:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>El sitio web estará disponible sin interrupciones</li>
              <li>Los contenidos sean completamente precisos o actualizados</li>
              <li>El sitio esté libre de virus u otros componentes dañinos</li>
            </ul>
            <p className="text-gray-700 mb-4">
              No seremos responsables de daños directos, indirectos, incidentales o consecuentes derivados del 
              uso o la imposibilidad de usar este sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Enlaces a Terceros</h2>
            <p className="text-gray-700 mb-4">
              Este sitio puede contener enlaces a sitios web de terceros. No controlamos ni respaldamos estos 
              sitios y no somos responsables de su contenido o prácticas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
              en vigor inmediatamente después de su publicación en el sitio. Su uso continuado del sitio después 
              de la publicación de cambios constituye su aceptación de los mismos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Terminación</h2>
            <p className="text-gray-700 mb-4">
              Podemos terminar o suspender su acceso al sitio inmediatamente, sin previo aviso, por cualquier 
              motivo, incluyendo la violación de estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ley Aplicable</h2>
            <p className="text-gray-700 mb-4">
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la República Dominicana. 
              Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de 
              los tribunales de Santo Domingo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para preguntas sobre estos términos de uso:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: <a href="mailto:info@informacionesleyni.com" className="text-blue-600 hover:text-blue-700">info@informacionesleyni.com</a></p>
              <p className="text-gray-700">Teléfono: +1 (809) 555-0123</p>
            </div>
          </section>

        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}
