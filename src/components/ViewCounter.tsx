'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  articleId: string
  initialViews?: number
}

export default function ViewCounter({ articleId, initialViews = 0 }: ViewCounterProps) {
  const [views] = useState(() => {
    // Inicializar desde localStorage si está disponible
    if (typeof window !== 'undefined') {
      const viewedKey = `article_viewed_${articleId}`
      const hasViewed = sessionStorage.getItem(viewedKey)
      
      if (!hasViewed) {
        // Primera vista - incrementar
        const storageKey = `article_views_${articleId}`
        const storedViews = localStorage.getItem(storageKey)
        const newViews = storedViews ? parseInt(storedViews, 10) + 1 : initialViews + 1
        
        localStorage.setItem(storageKey, newViews.toString())
        sessionStorage.setItem(viewedKey, 'true')
        return newViews
      } else {
        // Ya visto - solo leer
        const storageKey = `article_views_${articleId}`
        const storedViews = localStorage.getItem(storageKey)
        return storedViews ? parseInt(storedViews, 10) : initialViews
      }
    }
    return initialViews
  })

  // Formatear número con comas
  const formatViews = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <Eye className="w-4 h-4" />
      <span className="text-sm font-medium">
        {formatViews(views)} {views === 1 ? 'vista' : 'vistas'}
      </span>
    </div>
  )
}
