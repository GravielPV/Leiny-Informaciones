import { ExternalLink, Image as ImageIcon, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'

export default function ImageHelpPage() {
  const validExamples = [
    'https://images.unsplash.com/photo-ejemplo.jpg',
    'https://i.imgur.com/ejemplo.png',
    'https://via.placeholder.com/600x400',
    'https://picsum.photos/600/400'
  ]

  const invalidExamples = [
    {
      url: 'https://share.google/images/ejemplo',
      reason: 'URLs de Google Share no son enlaces directos a imágenes'
    },
    {
      url: 'https://drive.google.com/file/d/ejemplo',
      reason: 'Google Drive requiere permisos especiales'
    },
    {
      url: 'https://photos.google.com/share/ejemplo',
      reason: 'Google Photos no permite enlace directo'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ImageIcon className="w-8 h-8 mr-3 text-blue-600" />
          Guía de URLs de Imagen
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Aprende cómo obtener URLs de imagen válidas para tus artículos
        </p>
      </div>

      <div className="space-y-8">
        {/* Qué son las URLs de imagen válidas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            ¿Qué es una URL de imagen válida?
          </h2>
          <p className="text-blue-800 mb-4">
            Una URL de imagen válida es un enlace directo que apunta directamente al archivo de imagen 
            (termina en .jpg, .png, .gif, .webp) y está disponible públicamente en internet.
          </p>
          <div className="bg-blue-100 border border-blue-300 rounded p-3">
            <p className="text-blue-900 font-medium">Características de una URL válida:</p>
            <ul className="mt-2 list-disc list-inside text-blue-800 space-y-1">
              <li>Enlaza directamente al archivo de imagen</li>
              <li>Es accesible públicamente (sin requerir inicio de sesión)</li>
              <li>Permite visualización directa en navegadores</li>
              <li>No requiere permisos especiales</li>
            </ul>
          </div>
        </div>

        {/* URLs válidas */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            ✅ Ejemplos de URLs válidas
          </h2>
          <div className="space-y-3">
            {validExamples.map((url, index) => (
              <div key={index} className="bg-green-100 border border-green-300 rounded p-3">
                <code className="text-green-800 break-all">{url}</code>
              </div>
            ))}
          </div>
        </div>

        {/* URLs problemáticas */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            ❌ URLs que NO funcionan
          </h2>
          <div className="space-y-4">
            {invalidExamples.map((example, index) => (
              <div key={index} className="bg-red-100 border border-red-300 rounded p-4">
                <code className="text-red-800 break-all block mb-2">{example.url}</code>
                <p className="text-red-700 text-sm">
                  <strong>Problema:</strong> {example.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios recomendados */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🌐 Servicios recomendados para hospedar imágenes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Unsplash
              </h3>
              <p className="text-gray-600 mb-3">
                Banco gratuito de imágenes de alta calidad. Perfecto para artículos profesionales.
              </p>
              <a 
                href="https://unsplash.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visitar Unsplash →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Imgur
              </h3>
              <p className="text-gray-600 mb-3">
                Hosting gratuito de imágenes. Ideal para subir tus propias fotos.
              </p>
              <a 
                href="https://imgur.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visitar Imgur →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Pexels
              </h3>
              <p className="text-gray-600 mb-3">
                Otra excelente fuente de imágenes gratuitas y de calidad profesional.
              </p>
              <a 
                href="https://pexels.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visitar Pexels →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Pixabay
              </h3>
              <p className="text-gray-600 mb-3">
                Amplia colección de imágenes libres de derechos para uso comercial.
              </p>
              <a 
                href="https://pixabay.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visitar Pixabay →
              </a>
            </div>
          </div>
        </div>

        {/* Cómo obtener el enlace correcto */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">
            🔗 Cómo obtener el enlace correcto
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-yellow-900">Desde Unsplash:</h3>
              <ol className="list-decimal list-inside text-yellow-800 mt-2 space-y-1">
                <li>Busca y selecciona una imagen</li>
                <li>Haz clic en Download free</li>
                <li>Copia la URL de descarga o usa el botón Copy link</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-yellow-900">Desde Imgur:</h3>
              <ol className="list-decimal list-inside text-yellow-800 mt-2 space-y-1">
                <li>Sube tu imagen a Imgur</li>
                <li>Haz clic derecho en la imagen subida</li>
                <li>Selecciona Copiar dirección de imagen</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium text-yellow-900">Desde cualquier sitio web:</h3>
              <ol className="list-decimal list-inside text-yellow-800 mt-2 space-y-1">
                <li>Haz clic derecho en la imagen</li>
                <li>Selecciona Copiar dirección de imagen</li>
                <li>Verifica que la URL termine en .jpg, .png, .gif o .webp</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Consejos adicionales */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            💡 Consejos adicionales
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-medium text-green-600 mr-2">✓</span>
              <span>Usa imágenes de alta resolución (mínimo 800x600 píxeles) para mejor calidad</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-green-600 mr-2">✓</span>
              <span>Prefiere formato JPG para fotos y PNG para gráficos con transparencia</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-green-600 mr-2">✓</span>
              <span>Asegúrate de tener permisos para usar la imagen (especialmente para uso comercial)</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-2">ℹ</span>
              <span>El sistema automáticamente proporcionará una imagen de respaldo si la URL no funciona</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}