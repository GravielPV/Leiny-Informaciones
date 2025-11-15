'use client'

interface ShareButtonsProps {
  title: string
  articleId: string
}

const ShareButtons = ({ title, articleId }: ShareButtonsProps) => {
  
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
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
      <div className="flex space-x-4">
        <span className="text-gray-600 font-medium">Compartir:</span>
        <button 
          onClick={() => handleShare('facebook')}
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium cursor-pointer"
        >
          Facebook
        </button>
        <button 
          onClick={() => handleShare('twitter')}
          className="text-blue-400 hover:text-blue-600 transition-colors font-medium cursor-pointer"
        >
          Twitter
        </button>
        <button 
          onClick={() => handleShare('whatsapp')}
          className="text-green-600 hover:text-green-800 transition-colors font-medium cursor-pointer"
        >
          WhatsApp
        </button>
      </div>
      <div className="text-sm text-gray-500">
        <span>ID: {articleId.substring(0, 8)}</span>
      </div>
    </div>
  )
}

export default ShareButtons