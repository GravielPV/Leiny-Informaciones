'use client'

import { Facebook, Twitter, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  articleId: string
  compact?: boolean
}

const ShareButtons = ({ title, articleId, compact = false }: ShareButtonsProps) => {
  
  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    if (typeof window === 'undefined') return

    const currentUrl = window.location.href
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
    }
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleShare('facebook')}
          className="text-gray-500 hover:text-blue-600 transition-colors p-1"
          aria-label="Compartir en Facebook"
          title="Compartir en Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="text-gray-500 hover:text-blue-400 transition-colors p-1"
          aria-label="Compartir en Twitter"
          title="Compartir en Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="text-gray-500 hover:text-green-600 transition-colors p-1"
          aria-label="Compartir en WhatsApp"
          title="Compartir en WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center space-x-4 text-gray-500 text-sm">
      <span className="font-medium">Compartir:</span>
      <button 
        onClick={() => handleShare('facebook')}
        className="hover:text-blue-600 transition-colors flex items-center space-x-1 font-medium"
        aria-label="Compartir en Facebook"
      >
        <Facebook className="w-4 h-4" />
        <span>Facebook</span>
      </button>
      <button 
        onClick={() => handleShare('twitter')}
        className="hover:text-blue-400 transition-colors flex items-center space-x-1 font-medium"
        aria-label="Compartir en Twitter"
      >
        <Twitter className="w-4 h-4" />
        <span>Twitter</span>
      </button>
      <button 
        onClick={() => handleShare('whatsapp')}
        className="hover:text-green-600 transition-colors flex items-center space-x-1 font-medium"
        aria-label="Compartir en WhatsApp"
      >
        <Share2 className="w-4 h-4" />
        <span>WhatsApp</span>
      </button>
    </div>
  )
}

export default ShareButtons