import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Las Informaciones con Leyni',
  description: 'Política de privacidad y protección de datos de Las Informaciones con Leyni',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-blue max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
            <p className="text-gray-700 mb-4">
              En <strong>Las Informaciones con Leyni</strong>, nos comprometemos a proteger su privacidad y 
              garantizar la seguridad de su información personal. Esta política de privacidad explica cómo 
              recopilamos, usamos y protegemos sus datos personales de acuerdo con la Ley 172-13 sobre 
              Protección de Datos Personales de la República Dominicana.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Información que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              Podemos recopilar los siguientes tipos de información:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Información de contacto:</strong> Nombre, dirección de correo electrónico</li>
              <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
              <li><strong>Información de uso:</strong> Páginas visitadas, tiempo de navegación, artículos leídos</li>
              <li><strong>Cookies:</strong> Pequeños archivos que mejoran su experiencia de navegación</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso de la Información</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Enviar boletines informativos (si se ha suscrito)</li>
              <li>Responder a sus consultas y solicitudes</li>
              <li>Analizar el uso del sitio web y mejorar la experiencia del usuario</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartir Información</h2>
            <p className="text-gray-700 mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los 
              siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Cuando sea requerido por ley o por orden judicial</li>
              <li>Para proteger nuestros derechos, propiedad o seguridad</li>
              <li>Con proveedores de servicios que nos ayudan a operar el sitio web</li>
              <li>Con su consentimiento explícito</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Las cookies son pequeños 
              archivos de texto que se almacenan en su dispositivo. Puede configurar su navegador para rechazar 
              cookies, aunque esto puede afectar algunas funcionalidades del sitio.
            </p>
            <p className="text-gray-700 mb-4">
              Tipos de cookies que utilizamos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
              <li><strong>Cookies analíticas:</strong> Para entender cómo los usuarios usan el sitio</li>
              <li><strong>Cookies de preferencias:</strong> Para recordar sus configuraciones</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seguridad de Datos</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal 
              contra acceso no autorizado, pérdida, destrucción o alteración. Sin embargo, ningún método de 
              transmisión por Internet es 100% seguro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sus Derechos</h2>
            <p className="text-gray-700 mb-4">
              De acuerdo con la Ley 172-13, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Acceder a sus datos personales</li>
              <li>Rectificar información inexacta o incompleta</li>
              <li>Cancelar o eliminar sus datos personales</li>
              <li>Oponerse al tratamiento de sus datos</li>
              <li>Revocar su consentimiento en cualquier momento</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Para ejercer estos derechos, contáctenos en: <a href="mailto:privacidad@informacionesleyni.com" className="text-blue-600 hover:text-blue-700">privacidad@informacionesleyni.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Enlaces a Terceros</h2>
            <p className="text-gray-700 mb-4">
              Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables de las 
              prácticas de privacidad de estos sitios. Le recomendamos leer sus políticas de privacidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Edad</h2>
            <p className="text-gray-700 mb-4">
              Nuestro sitio web no está dirigido a menores de 18 años. No recopilamos intencionalmente 
              información personal de menores sin el consentimiento de sus padres o tutores.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cambios a esta Política</h2>
            <p className="text-gray-700 mb-4">
              Podemos actualizar esta política de privacidad periódicamente. Le notificaremos de cualquier 
              cambio significativo publicando la nueva política en esta página con una fecha de actualización.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para preguntas sobre esta política de privacidad o sobre el manejo de sus datos personales:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: <a href="mailto:privacidad@informacionesleyni.com" className="text-blue-600 hover:text-blue-700">privacidad@informacionesleyni.com</a></p>
              <p className="text-gray-700">Teléfono: +1 (809) 555-0123</p>
              <p className="text-gray-700">Dirección: Santo Domingo, República Dominicana</p>
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
