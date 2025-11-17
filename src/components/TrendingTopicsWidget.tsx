'use client'

import Link from 'next/link'
import { Hash, TrendingUp } from 'lucide-react'

interface TrendingTopic {
  tag: string
  count: number
  slug: string
}

interface TrendingTopicsWidgetProps {
  topics?: TrendingTopic[]
}

export default function TrendingTopicsWidget({ topics }: TrendingTopicsWidgetProps) {
  // Topics por defecto si no se proveen
  const defaultTopics: TrendingTopic[] = [
    { tag: 'Política', count: 23, slug: 'politica' },
    { tag: 'Economía', count: 18, slug: 'economia' },
    { tag: 'Santo Domingo', count: 15, slug: 'santo-domingo' },
    { tag: 'Salud', count: 12, slug: 'salud' },
    { tag: 'Educación', count: 10, slug: 'educacion' },
    { tag: 'Tecnología', count: 8, slug: 'tecnologia' },
    { tag: 'Medio Ambiente', count: 7, slug: 'medio-ambiente' },
    { tag: 'Cultura', count: 6, slug: 'cultura' },
  ]

  const displayTopics = topics || defaultTopics

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4 border-b border-blue-200 pb-3">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Trending Topics
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTopics.map((topic, index) => (
          <Link
            key={topic.slug}
            href={`/buscar?q=${encodeURIComponent(topic.tag)}`}
            className={`group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              index === 0
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : index === 1
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : index === 2
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Hash className="w-3 h-3" />
            <span>{topic.tag}</span>
            <span className="text-xs opacity-75">({topic.count})</span>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Los temas más discutidos en las últimas 24 horas
        </p>
      </div>
    </div>
  )
}
