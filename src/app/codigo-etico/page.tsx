import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Código Ético | Las Informaciones con Leyni',
  description: 'Código ético periodístico de Las Informaciones con Leyni',
}

export default function CodigoEticoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Código Ético Periodístico</h1>
          <p className="text-gray-600">
            Nuestro compromiso con la verdad y la sociedad dominicana
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-blue max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 mb-4">
              En <strong>Las Informaciones con Leyni</strong>, nos comprometemos a ejercer un periodismo 
              responsable, veraz y ético que sirva al interés público y contribuya al fortalecimiento de la 
              democracia en la República Dominicana.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Veracidad y Exactitud</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-gray-800 font-medium mb-2">Nos comprometemos a:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Verificar la información antes de publicarla</li>
                <li>Contrastar fuentes múltiples e independientes</li>
                <li>Distinguir claramente entre hechos y opiniones</li>
                <li>Corregir errores de manera oportuna y transparente</li>
                <li>No publicar rumores o información no verificada</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Independencia e Imparcialidad</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-gray-800 font-medium mb-2">Mantenemos:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Independencia editorial frente a intereses políticos y económicos</li>
                <li>Imparcialidad en la cobertura de noticias</li>
                <li>Separación clara entre contenido editorial y publicitario</li>
                <li>Rechazo a presiones externas que comprometan nuestra objetividad</li>
                <li>Transparencia sobre posibles conflictos de interés</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Respeto a la Dignidad Humana</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-gray-800 font-medium mb-2">Respetamos:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>La dignidad, privacidad y derechos de las personas</li>
                <li>La presunción de inocencia</li>
                <li>La sensibilidad en casos de víctimas y menores</li>
                <li>La diversidad cultural, étnica y social</li>
                <li>Los límites éticos en el tratamiento de imágenes</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidad Social</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-gray-800 font-medium mb-2">Asumimos:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Responsabilidad por el impacto social de nuestras publicaciones</li>
                <li>Compromiso con el interés público sobre el sensacionalismo</li>
                <li>Rechazo a la incitación al odio, violencia o discriminación</li>
                <li>Promoción de valores democráticos y derechos humanos</li>
                <li>Contribución al debate público informado</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Protección de Fuentes</h2>
            <p className="text-gray-700 mb-4">
              Protegemos la confidencialidad de nuestras fuentes cuando estas lo soliciten, salvo que la ley 
              nos obligue a revelarlas. Nunca comprometemos la seguridad de quienes confían en nosotros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Transparencia</h2>
            <p className="text-gray-700 mb-4">
              Practicamos la transparencia en:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Identificación clara de autores y fuentes</li>
              <li>Reconocimiento de errores y correcciones</li>
              <li>Explicación de nuestros procesos editoriales</li>
              <li>Apertura al diálogo con nuestra audiencia</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Profesionalismo</h2>
            <p className="text-gray-700 mb-4">
              Nuestro equipo periodístico se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Formación continua y actualización profesional</li>
              <li>Aplicación de los más altos estándares periodísticos</li>
              <li>Ética en la obtención y uso de información</li>
              <li>Respeto a los colegas y competidores</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Derecho de Réplica</h2>
            <p className="text-gray-700 mb-4">
              Garantizamos el derecho de réplica a personas o instituciones afectadas por nuestras publicaciones, 
              ofreciendo un espacio equitativo para sus aclaraciones o respuestas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Uso Ético de Tecnología</h2>
            <p className="text-gray-700 mb-4">
              Nos comprometemos al uso responsable de tecnología y redes sociales, evitando la manipulación de 
              contenido y respetando los derechos digitales de nuestra audiencia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto y Quejas</h2>
            <p className="text-gray-700 mb-4">
              Valoramos sus comentarios y sugerencias sobre nuestro trabajo periodístico:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: <a href="mailto:etica@informacionesleyni.com" className="text-blue-600 hover:text-blue-700">etica@informacionesleyni.com</a></p>
              <p className="text-gray-700">Teléfono: +1 (809) 555-0123</p>
              <p className="text-gray-700 mt-2">
                <strong>Ombudsman:</strong> Para quejas sobre contenido ético
              </p>
            </div>
          </section>

          <div className="bg-blue-100 border border-blue-200 rounded-lg p-6 mt-8">
            <p className="text-gray-800 font-medium text-center">
              "El periodismo es una responsabilidad pública. Cada palabra cuenta, cada imagen tiene impacto. 
              Nos comprometemos a ejercer nuestra profesión con integridad y al servicio de la verdad."
            </p>
            <p className="text-gray-600 text-sm text-center mt-2">- Equipo Editorial, Las Informaciones con Leyni</p>
          </div>

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
