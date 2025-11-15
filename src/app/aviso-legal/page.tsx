import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | Las Informaciones con Leyni',
  description: 'Aviso legal y términos de uso del sitio web Las Informaciones con Leyni',
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Aviso Legal</h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-blue max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
            <p className="text-gray-700 mb-4">
              En cumplimiento de la Ley 53-07 sobre Crímenes y Delitos de Alta Tecnología de la República Dominicana,
              se informa que este sitio web es propiedad de:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-gray-800 font-medium">Las Informaciones con Leyni</p>
              <p className="text-gray-700">RNC: [Número de RNC]</p>
              <p className="text-gray-700">Domicilio: Santo Domingo, República Dominicana</p>
              <p className="text-gray-700">Email: info@informacionesleyni.com</p>
              <p className="text-gray-700">Teléfono: +1 (809) 555-0123</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objeto</h2>
            <p className="text-gray-700 mb-4">
              El presente aviso legal regula el uso del sitio web <strong>Las Informaciones con Leyni</strong>, 
              que pone a disposición de los usuarios de Internet información periodística y servicios de comunicación.
            </p>
            <p className="text-gray-700 mb-4">
              La utilización del sitio web implica la aceptación plena y sin reservas de todas y cada una de las 
              disposiciones incluidas en este aviso legal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, 
              tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya 
              propiedad pertenece a <strong>Las Informaciones con Leyni</strong>.
            </p>
            <p className="text-gray-700 mb-4">
              Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier 
              otra actividad que se pueda realizar con los contenidos sin el permiso previo y por escrito del titular.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              <strong>Las Informaciones con Leyni</strong> no se hace responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>La continuidad y disponibilidad de los contenidos</li>
              <li>La ausencia de errores en dichos contenidos</li>
              <li>La ausencia de virus y/o demás componentes dañinos</li>
              <li>Los daños o perjuicios que cause cualquier persona que vulnere la seguridad del sitio</li>
              <li>El contenido de sitios web de terceros a los que se pueda acceder mediante enlaces</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Enlaces</h2>
            <p className="text-gray-700 mb-4">
              El sitio web puede contener enlaces a otros sitios web de terceros. 
              <strong>Las Informaciones con Leyni</strong> no asume ninguna responsabilidad por el contenido, 
              información o servicios que pudieran aparecer en dichos sitios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              <strong>Las Informaciones con Leyni</strong> se reserva el derecho de efectuar sin previo aviso 
              las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto 
              los contenidos y servicios que se presten a través de la misma como la forma en la que éstos 
              aparezcan presentados o localizados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Legislación Aplicable</h2>
            <p className="text-gray-700 mb-4">
              Las presentes condiciones se rigen por la legislación de la República Dominicana. Para cualquier 
              controversia que pudiera surgir en relación con el sitio web o la interpretación de estas condiciones, 
              las partes se someten expresamente a la jurisdicción de los tribunales de Santo Domingo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para cualquier consulta relacionada con este aviso legal, puede contactarnos en:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: <a href="mailto:legal@informacionesleyni.com" className="text-blue-600 hover:text-blue-700">legal@informacionesleyni.com</a></p>
              <p className="text-gray-700">Teléfono: +1 (809) 555-0123</p>
            </div>
          </section>

        </div>

        {/* Back button */}
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
