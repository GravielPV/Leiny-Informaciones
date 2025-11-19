'use client'

import { useEffect } from 'react'
import { ADSENSE_CONFIG } from '@/lib/constants'

interface AdSenseAdProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
}

export default function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ''
}: AdSenseAdProps) {
  const isDev = process.env.NODE_ENV === 'development'
  // Verificar si es un ID de placeholder
  const isPlaceholder = adSlot === '1234567890' || adSlot === '9876543210'

  useEffect(() => {
    if (isDev || isPlaceholder) return // No cargar ads en desarrollo o si es placeholder

    try {
      // @ts-expect-error - adsbygoogle is loaded by Google AdSense script
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-expect-error - adsbygoogle is loaded by Google AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [isDev, isPlaceholder])

  if (isDev) {
    return (
      <div className={`adsense-container ${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm font-medium p-4`}>
        <div className="text-center">
          <p>Anuncio de Google AdSense</p>
          <p className="text-xs mt-1">Slot ID: {adSlot}</p>
          <p className="text-xs">(Visible solo en producción)</p>
        </div>
      </div>
    )
  }

  // Si es placeholder en producción, no renderizar nada para evitar errores 400
  if (isPlaceholder) {
    return null
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
