'use client'

import { useState, useEffect } from 'react'

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }

    // Actualizar inmediatamente
    updateTime()
    
    // Actualizar cada segundo
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <span className="font-medium hidden sm:inline">
        República Dominicana - {currentDate || 'cargando...'}
      </span>
      <span className="font-medium sm:hidden">
        {currentDate || '...'}
      </span>
      <span className="font-medium">
        🕒 {currentTime || '--:--'}
      </span>
    </>
  )
}
