'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface MostReadArticle {
  id: string
  title: string
  image_url?: string
  created_at: string
  categories?: { name: string }[]
  excerpt: string
}

interface MostReadWidgetProps {
  articles: MostReadArticle[]
  limit?: number
}

export default function MostReadWidget({ articles, limit = 5 }: MostReadWidgetProps) {
  const topArticles = articles.slice(0, limit)

  if (!topArticles || topArticles.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4 border-b border-blue-200 pb-3">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Más Leídos
        </h3>
      </div>
      
      <div className="space-y-4">
        {topArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/articulos/${article.id}`}
            className="group flex space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 hover:bg-gray-50 p-2 -mx-2 rounded transition-colors"
          >
            {/* Ranking Number */}
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 flex items-center justify-center rounded font-bold text-lg ${
                index === 0 
                  ? 'bg-red-500 text-white' 
                  : index === 1 
                  ? 'bg-orange-500 text-white' 
                  : index === 2
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {index + 1}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded">
              <OptimizedImage
                src={article.image_url || ''}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="64px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                {article.title}
              </h4>
              {article.categories && article.categories.length > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {article.categories[0].name}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
