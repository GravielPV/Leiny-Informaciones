'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { incrementArticleView } from '@/app/actions'

interface ViewCounterProps {
  articleId: string
  initialViews?: number
}

export default function ViewCounter({ articleId, initialViews = 0 }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews)
  const [hasIncremented, setHasIncremented] = useState(false)

  useEffect(() => {
    if (hasIncremented) return

    const increment = async () => {
      const storageKey = `viewed_article_${articleId}`
      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return

      try {
        await incrementArticleView(articleId)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, 'true')
        }
        setViews(prev => prev + 1)
        setHasIncremented(true)
      } catch (error) {
        console.error('Error updating views:', error)
      }
    }

    increment()
  }, [articleId, hasIncremented])

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
