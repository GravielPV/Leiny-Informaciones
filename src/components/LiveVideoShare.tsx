'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Check, 
  Twitter, 
  Facebook, 
  MessageCircle, 
  Share2 
} from 'lucide-react'

interface LiveVideoShareProps {
  title: string
  url: string
}

export default function LiveVideoShare({ title, url: initialUrl }: LiveVideoShareProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState(initialUrl)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      color: 'bg-black hover:bg-gray-800 text-white',
      borderColor: 'border-transparent'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      borderColor: 'border-transparent'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
      color: 'bg-[#25D366] hover:bg-[#20bd5a] text-white',
      borderColor: 'border-transparent'
    }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Compartir Video
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Copy Link Button - Primary Action */}
        <div className="relative flex items-center">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="w-full pl-3 pr-24 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-1 top-1 bottom-1 px-3 flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-200 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md ${link.color}`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}