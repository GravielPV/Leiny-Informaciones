'use client'

interface LiveVideoShareProps {
  title: string
  url: string
}

export default function LiveVideoShare({ title, url }: LiveVideoShareProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    alert('¡Enlace copiado al portapapeles!')
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Compartir
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          📋 Copiar enlace
        </button>
        
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          🐦 Twitter
        </a>
        
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          📘 Facebook
        </a>
        
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          💬 WhatsApp
        </a>
      </div>
    </>
  )
}