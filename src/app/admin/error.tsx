'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-bold text-red-800 mb-2">
          Algo salió mal en el panel
        </h2>
        <p className="text-sm text-red-600 mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>
        <button
          onClick={reset}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
