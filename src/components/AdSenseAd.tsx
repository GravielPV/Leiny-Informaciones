'use client'

import { useEffect } from 'react'

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

  useEffect(() => {
    if (isDev) return // No cargar ads en desarrollo

    try {
      // @ts-expect-error - adsbygoogle is loaded by Google AdSense script
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-expect-error - adsbygoogle is loaded by Google AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [isDev])

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

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7405911291221724"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
