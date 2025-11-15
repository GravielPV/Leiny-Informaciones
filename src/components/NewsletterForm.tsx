'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'default' | 'sidebar' | 'footer'
  className?: string
}

export default function NewsletterForm({ variant = 'default', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Por favor ingresa un email válido')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Por favor ingresa un email válido')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      // Intentar insertar el suscriptor
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.trim().toLowerCase(),
            status: 'active',
            confirmed_at: new Date().toISOString(),
            source: 'website'
          }
        ])

      if (error) {
        if (error.code === '23505') { // Violación de constraint unique
          setStatus('error')
          setMessage('Este email ya está suscrito a nuestro boletín')
        } else {
          console.error('Error al suscribir:', error)
          setStatus('error')
          setMessage('Error al procesar la suscripción. Inténtalo de nuevo.')
        }
      } else {
        setStatus('success')
        setMessage('¡Gracias! Te has suscrito exitosamente a nuestro boletín.')
        setEmail('')
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      setStatus('error')
      setMessage('Error inesperado. Por favor inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Estilos según la variante
  const getStyles = () => {
    switch (variant) {
      case 'sidebar':
        return {
          container: 'bg-blue-900 text-white p-6',
          title: 'text-lg font-bold mb-4',
          description: 'text-sm text-blue-100 mb-4',
          input: 'w-full px-3 py-2 text-gray-900 text-sm rounded-sm border-0 focus:ring-2 focus:ring-blue-300',
          button: 'w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm font-medium transition-colors',
          disclaimer: 'text-xs text-blue-200 mt-3'
        }
      case 'footer':
        return {
          container: 'bg-gray-800 text-white p-8',
          title: 'text-xl font-bold mb-4',
          description: 'text-gray-300 mb-6',
          input: 'w-full px-4 py-3 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500',
          button: 'w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-medium transition-colors rounded-md',
          disclaimer: 'text-sm text-gray-400 mt-4'
        }
      default:
        return {
          container: 'bg-white border border-gray-200 p-6 rounded-lg',
          title: 'text-xl font-bold text-gray-900 mb-4',
          description: 'text-gray-600 mb-6',
          input: 'w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          button: 'w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-medium transition-colors rounded-md',
          disclaimer: 'text-sm text-gray-500 mt-4'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 mr-2" />
        <h3 className={styles.title}>Suscríbete al Boletín</h3>
      </div>
      
      <p className={styles.description}>
        Recibe las noticias más importantes del día directamente en tu correo electrónico.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={loading}
            className={`${styles.input} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Suscribiendo...
            </>
          ) : (
            'SUSCRIBIRSE'
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status !== 'idle' && message && (
        <div className={`mt-4 p-3 rounded-md flex items-start ${
          status === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${
            status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </p>
        </div>
      )}

      <p className={styles.disclaimer}>
        *Al suscribirte aceptas nuestra política de privacidad y podrás cancelar en cualquier momento.
      </p>
    </div>
  )
}