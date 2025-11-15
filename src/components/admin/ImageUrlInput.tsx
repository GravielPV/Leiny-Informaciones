'use client'

import { useState, useCallback } from 'react'
import { AlertCircle, Check, ExternalLink, Image as ImageIcon, RefreshCw, Upload, Link2 } from 'lucide-react'
import { getValidImageUrl, FALLBACK_IMAGES } from '@/utils/imageUtils'
import OptimizedImage from '@/components/OptimizedImage'
import ImageUpload from './ImageUpload'

interface ImageUrlInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

const ImageUrlInput = ({ 
  value, 
  onChange, 
  label = "URL de Imagen Principal",
  placeholder = "https://ejemplo.com/imagen.jpg",
  className = ""
}: ImageUrlInputProps) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'blocked'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadError, setUploadError] = useState('')

  // URLs problemáticas conocidas
  const isGoogleShareUrl = (url: string) => {
    return url.includes('share.google') || 
           url.includes('photos.google.com') ||
           url.includes('drive.google.com/file')
  }

  const validateImageUrl = useCallback(async (url: string) => {
    if (!url.trim()) {
      setValidationStatus('idle')
      setErrorMessage('')
      setPreviewUrl('')
      return
    }

    setIsValidating(true)
    setValidationStatus('idle')

    try {
      // Verificar si es una URL de Google Share problemática
      if (isGoogleShareUrl(url)) {
        setValidationStatus('blocked')
        setErrorMessage('Las URLs de Google Drive/Photos no funcionan directamente. Por favor, use una imagen de un servicio público como Unsplash, o suba la imagen a un hosting de imágenes.')
        setPreviewUrl('')
        setIsValidating(false)
        return
      }

      // Validar formato de URL
      try {
        new URL(url)
      } catch {
        setValidationStatus('invalid')
        setErrorMessage('URL no válida. Asegúrese de incluir http:// o https://')
        setPreviewUrl('')
        setIsValidating(false)
        return
      }

      // Verificar si es una URL de imagen válida
      const validUrl = getValidImageUrl(url)
      if (validUrl === url) {
        // La URL es válida, intentar cargar la imagen
        const img = new Image()
        img.onload = () => {
          setValidationStatus('valid')
          setErrorMessage('')
          setPreviewUrl(url)
          setIsValidating(false)
        }
        img.onerror = () => {
          setValidationStatus('invalid')
          setErrorMessage('No se pudo cargar la imagen desde esta URL. Verifique que la imagen existe y es accesible públicamente.')
          setPreviewUrl('')
          setIsValidating(false)
        }
        img.src = url
      } else {
        setValidationStatus('invalid')
        setErrorMessage('URL de imagen no válida o de un dominio no permitido.')
        setPreviewUrl('')
        setIsValidating(false)
      }
    } catch {
      setValidationStatus('invalid')
      setErrorMessage('Error al validar la imagen')
      setPreviewUrl('')
      setIsValidating(false)
    }
  }, [])

  const handleInputChange = (newUrl: string) => {
    onChange(newUrl)
    
    // Validar después de un pequeño delay para evitar muchas llamadas
    if (newUrl.trim()) {
      setTimeout(() => validateImageUrl(newUrl), 500)
    } else {
      setValidationStatus('idle')
      setErrorMessage('')
      setPreviewUrl('')
    }
  }

  const selectFallbackImage = (fallbackUrl: string) => {
    onChange(fallbackUrl)
    setValidationStatus('valid')
    setErrorMessage('')
    setPreviewUrl(fallbackUrl)
  }

  const handleUploadSuccess = (url: string) => {
    setActiveTab('url')
    onChange(url)
    setValidationStatus('valid')
    setErrorMessage('')
    setPreviewUrl(url)
    setUploadError('')
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
  }

  const getStatusIcon = () => {
    if (isValidating) return <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
    if (validationStatus === 'valid') return <Check className="w-4 h-4 text-green-500" />
    if (validationStatus === 'invalid' || validationStatus === 'blocked') return <AlertCircle className="w-4 h-4 text-red-500" />
    return <ImageIcon className="w-4 h-4 text-gray-400" />
  }

  const getStatusColor = () => {
    if (validationStatus === 'valid') return 'border-green-500 focus:border-green-500 focus:ring-green-500'
    if (validationStatus === 'invalid' || validationStatus === 'blocked') return 'border-red-500 focus:border-red-500 focus:ring-red-500'
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'url'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Link2 className="w-4 h-4 mr-2" />
          URL de Imagen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivo
        </button>
      </div>

      {/* Contenido según tab activa */}
      {activeTab === 'url' ? (
        <div className="space-y-4">
          {/* Input con validación */}
          <div className="relative">
            <input
              type="url"
              id="imageUrl"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-1 transition-colors ${getStatusColor()}`}
              placeholder={placeholder}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {getStatusIcon()}
            </div>
          </div>

          {/* Mensaje de error/estado */}
          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{errorMessage}</p>
                  {validationStatus === 'blocked' && (
                    <div className="mt-2">
                      <p className="font-medium">Alternativas recomendadas:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Unsplash.com <ExternalLink className="w-3 h-3 ml-1" /></a> - Imágenes gratuitas de alta calidad</li>
                        <li><a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Imgur.com <ExternalLink className="w-3 h-3 ml-1" /></a> - Hosting gratuito de imágenes</li>
                        <li>Usar las imágenes sugeridas abajo o subir un archivo en la pestaña &quot;Subir Archivo&quot;</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <ImageUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            currentImageUrl={previewUrl}
          />
          {uploadError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p>{uploadError}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista previa */}
      {previewUrl && validationStatus === 'valid' && activeTab === 'url' && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
          <div className="w-full max-w-sm">
            <OptimizedImage
              src={previewUrl}
              alt="Vista previa de imagen"
              width={300}
              height={200}
              className="rounded-md border"
            />
          </div>
        </div>
      )}

      {/* Imágenes sugeridas - solo mostrar en tab URL */}
      {activeTab === 'url' && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">O seleccione una imagen sugerida:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FALLBACK_IMAGES.slice(0, 6).map((imageUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectFallbackImage(imageUrl)}
                className="relative group overflow-hidden rounded-md border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Imagen sugerida ${index + 1}`}
                  width={120}
                  height={80}
                  className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">
        {activeTab === 'url' 
          ? 'Las imágenes deben ser accesibles públicamente y preferiblemente en formato JPG, PNG o WebP.'
          : 'Sube una imagen desde tu computadora. Se almacenará de forma segura y se optimizará automáticamente.'
        }
      </p>
    </div>
  )
}

export default ImageUrlInput