'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()

  useEffect(() => {
    // Animación de fade-in al cambiar de página
    document.body.style.opacity = '0'
    
    const timer = setTimeout(() => {
      document.body.style.transition = 'opacity 0.3s ease-in-out'
      document.body.style.opacity = '1'
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname])

  return null
}
