'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInSectionProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade'
  className?: string
}

export default function FadeInSection({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Una vez visible, dejar de observar
          if (domRef.current) {
            observer.unobserve(domRef.current)
          }
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    const currentRef = domRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0'
    
    switch (direction) {
      case 'fade':
        return 'animate-fade-in'
      case 'left':
        return 'animate-slide-in-left'
      case 'right':
        return 'animate-slide-in-right'
      case 'up':
      default:
        return 'animate-slide-up'
    }
  }

  const getDelayClass = () => {
    if (delay === 100) return 'animation-delay-100'
    if (delay === 200) return 'animation-delay-200'
    if (delay === 300) return 'animation-delay-300'
    if (delay === 400) return 'animation-delay-400'
    return ''
  }

  return (
    <div
      ref={domRef}
      className={`${getAnimationClass()} ${getDelayClass()} ${className}`}
      style={{
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  )
}
