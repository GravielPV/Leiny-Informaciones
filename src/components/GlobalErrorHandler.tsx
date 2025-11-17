'use client'

import { useEffect } from 'react'

/**
 * Componente para manejar errores globales y suprimir errores de extensiones del navegador
 * Solo activo en desarrollo
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return
    }
    
    // Suprimir errores específicos de extensiones del navegador
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      
      // Lista de errores que queremos suprimir (extensiones del navegador)
      const suppressedErrors = [
        'A listener indicated an asynchronous response by returning true',
        '[ECOMMERCE]',
        'Extension context invalidated',
        'Could not establish connection',
        'The message port closed before a response was received',
        'Invalid Refresh Token',
        'Refresh Token Not Found',
        'AuthApiError',
        'No URL provided, using default image'
      ]
      
      // Solo mostrar el error si no está en la lista de suprimidos
      const shouldSuppress = suppressedErrors.some(error => 
        message.includes(error)
      )
      
      if (!shouldSuppress) {
        originalConsoleError(...args)
      }
    }
    
    // Manejar errores no capturados
    const handleUnhandledErrors = (event: ErrorEvent) => {
      const message = event.message || ''
      
      // Suprimir errores de extensiones del navegador y Supabase
      if (
        message.includes('Extension context invalidated') ||
        message.includes('A listener indicated an asynchronous response') ||
        message.includes('[ECOMMERCE]') ||
        message.includes('Invalid Refresh Token') ||
        message.includes('AuthApiError')
      ) {
        event.preventDefault()
        return false
      }
    }
    
    // Manejar promesas rechazadas
    const handleUnhandledRejections = (event: PromiseRejectionEvent) => {
      const message = String(event.reason)
      
      if (
        message.includes('Extension context invalidated') ||
        message.includes('A listener indicated an asynchronous response') ||
        message.includes('[ECOMMERCE]') ||
        message.includes('Invalid Refresh Token') ||
        message.includes('AuthApiError') ||
        message.includes('Refresh Token Not Found')
      ) {
        event.preventDefault()
        return false
      }
    }
    
    window.addEventListener('error', handleUnhandledErrors)
    window.addEventListener('unhandledrejection', handleUnhandledRejections)
    
    return () => {
      console.error = originalConsoleError
      window.removeEventListener('error', handleUnhandledErrors)
      window.removeEventListener('unhandledrejection', handleUnhandledRejections)
    }
  }, [])
  
  return null
}