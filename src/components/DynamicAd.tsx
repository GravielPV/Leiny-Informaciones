'use client'

import { useAdSettings } from '@/context/AdSettingsContext'
import AdSenseAd from './AdSenseAd'
import OptimizedImage from './OptimizedImage'
import { ADSENSE_CONFIG } from '@/lib/constants'

interface DynamicAdProps {
  slotKey: keyof typeof ADSENSE_CONFIG.SLOTS
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
}

export default function DynamicAd({ 
  slotKey, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ''
}: DynamicAdProps) {
  const { settings, loading } = useAdSettings()
  
  // Obtener el ID del slot desde la configuración
  const adSlotId = ADSENSE_CONFIG.SLOTS[slotKey]
  
  // Obtener configuración específica para este slot
  const setting = settings[slotKey]

  // Si está cargando, mostrar un placeholder o nada (evitar layout shift si es posible)
  if (loading) {
    return <div className={`min-h-[100px] bg-gray-50 animate-pulse ${className}`}></div>
  }

  // Si no hay configuración, usar AdSense por defecto (comportamiento original)
  if (!setting) {
    return (
      <AdSenseAd 
        adSlot={adSlotId}
        adFormat={adFormat}
        fullWidthResponsive={fullWidthResponsive}
        className={className}
      />
    )
  }

  // Si está desactivado, no mostrar nada
  if (!setting.is_active) {
    return null
  }

  // Si es tipo Custom
  if (setting.type === 'custom') {
    // Prioridad al código HTML personalizado
    if (setting.custom_code) {
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: setting.custom_code }}
        />
      )
    }

    if (!setting.custom_image_url) return null

    const Content = (
      <div className={`relative w-full overflow-hidden flex justify-center ${className}`}>
        <OptimizedImage
          src={setting.custom_image_url}
          alt="Anuncio"
          width={800}
          height={250}
          className="max-w-full h-auto object-contain"
        />
        <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] px-1 opacity-50">
          Publicidad
        </div>
      </div>
    )

    if (setting.custom_link_url) {
      return (
        <a 
          href={setting.custom_link_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-95 transition-opacity"
        >
          {Content}
        </a>
      )
    }

    return Content
  }

  // Si es tipo AdSense
  return (
    <AdSenseAd 
      adSlot={adSlotId}
      adFormat={adFormat}
      fullWidthResponsive={fullWidthResponsive}
      className={className}
    />
  )
}
