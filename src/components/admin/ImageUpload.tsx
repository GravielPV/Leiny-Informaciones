'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { uploadImage, UploadResult } from '@/lib/supabase/storage'
import OptimizedImage from '@/components/OptimizedImage'

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  onUploadError: (error: string) => void
  currentImageUrl?: string
  className?: string
}

const ImageUpload = ({ 
  onUploadSuccess, 
  onUploadError, 
  currentImageUrl,
  className = "" 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simular progreso mientras se sube
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + 10
          return prev
        })
      }, 200)

      const result: UploadResult = await uploadImage(file, 'articles')
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url) {
        onUploadSuccess(result.url)
        setTimeout(() => {
          setUploadProgress(0)
          setIsUploading(false)
        }, 500)
      } else {
        onUploadError(result.error || 'Error al subir la imagen')
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (error) {
      onUploadError('Error inesperado al subir la imagen')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFileSelect(file)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}
        `}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-gray-900">Subiendo imagen...</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF, WebP hasta 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vista previa de imagen actual */}
      {currentImageUrl && !isUploading && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Imagen actual:</p>
          <div className="relative inline-block">
            <OptimizedImage
              src={currentImageUrl}
              alt="Imagen actual"
              width={200}
              height={133}
              className="rounded-md border shadow-sm"
            />
            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Formatos soportados: JPG, PNG, GIF, WebP</p>
        <p>• Tamaño máximo: 5MB</p>
        <p>• Se recomienda usar imágenes de al menos 800x600 píxeles</p>
        <p>• Las imágenes se optimizan automáticamente para web</p>
      </div>
    </div>
  )
}

export default ImageUpload