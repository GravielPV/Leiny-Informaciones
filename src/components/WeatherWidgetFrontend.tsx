'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CloudRain, Wind, Droplets, Thermometer, MapPin, Calendar } from 'lucide-react'

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  pressure: number
  emoji: string
  isDay: boolean
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    emoji: string
  }>
}

// Función para obtener emoji basado en la condición
const getWeatherEmoji = (condition: string, isDay: boolean = true) => {
  const lower = condition.toLowerCase()
  
  if (lower.includes('soleado') || lower.includes('despejado')) {
    return isDay ? '☀️' : '🌙'
  }
  if (lower.includes('parcialmente nublado') || lower.includes('poco nublado')) {
    return isDay ? '⛅' : '☁️'
  }
  if (lower.includes('nublado')) {
    return '☁️'
  }
  if (lower.includes('lluvia') && lower.includes('ligera')) {
    return '🌦️'
  }
  if (lower.includes('lluvia') || lower.includes('llovizna')) {
    return '🌧️'
  }
  if (lower.includes('tormenta')) {
    return '⛈️'
  }
  if (lower.includes('niebla')) {
    return '🌫️'
  }
  
  return isDay ? '☀️' : '🌙' // Default
}

export default function WeatherWidgetFrontend() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Asegurar que estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchWeatherData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Usar OpenMeteo como fuente principal (más confiable y detallada)
      try {
        // Coordenadas de Bajos de Haina: 18.4274, -70.0383
        const lat = 18.4274
        const lon = -70.0383
        
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSanto_Domingo&forecast_days=4`,
          { cache: 'no-cache' }
        )
        
        if (weatherResponse.ok) {
          const data = await weatherResponse.json()
          
          // Mapear códigos de clima a condiciones en español
          const getConditionFromCode = (code: number) => {
            const codes: { [key: number]: string } = {
              0: 'Despejado',
              1: 'Mayormente despejado',
              2: 'Parcialmente nublado',
              3: 'Nublado',
              45: 'Neblina',
              48: 'Niebla con escarcha',
              51: 'Llovizna ligera',
              53: 'Llovizna moderada',
              55: 'Llovizna densa',
              61: 'Lluvia ligera',
              63: 'Lluvia moderada',
              65: 'Lluvia fuerte',
              80: 'Chubascos ligeros',
              81: 'Chubascos moderados',
              82: 'Chubascos fuertes',
              95: 'Tormenta',
              96: 'Tormenta con granizo',
              99: 'Tormenta fuerte'
            }
            return codes[code] || 'Despejado'
          }
          
          const currentCondition = getConditionFromCode(data.current.weather_code)
          const isDay = data.current.is_day === 1
          
          const meteoWeatherData: WeatherData = {
            location: 'Bajos de Haina, RD',
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            condition: currentCondition,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // m/s to km/h
            pressure: Math.round(data.current.surface_pressure),
            emoji: getWeatherEmoji(currentCondition, isDay),
            isDay: isDay,
            forecast: data.daily.weather_code.slice(1, 4).map((code: number, index: number) => {
              const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
              const today = new Date().getDay()
              const dayCondition = getConditionFromCode(code)
              
              return {
                day: days[(today + index + 1) % 7],
                high: Math.round(data.daily.temperature_2m_max[index + 1]),
                low: Math.round(data.daily.temperature_2m_min[index + 1]),
                condition: dayCondition,
                emoji: getWeatherEmoji(dayCondition, true) // Forecast always shows day icons usually
              }
            })
          }
          
          setWeather(meteoWeatherData)
          setLastUpdate(new Date())
          return
        }
      } catch (meteoError) {
        console.warn('Open-Meteo no disponible:', meteoError)
        throw meteoError // Trigger fallback
      }
      
    } catch (err) {
      // Fallback a datos estimados si falla la API
      console.error('Weather fetch error, using fallback:', err)
      
      const currentHour = new Date().getHours()
      const isDay = currentHour >= 6 && currentHour <= 18
      const currentCondition = isDay ? 'Soleado' : 'Despejado'
      const baseTemp = isDay 
        ? 29 + Math.sin((currentHour - 6) * Math.PI / 12) * 3 
        : 26
        
      const fallbackData: WeatherData = {
        location: 'Bajos de Haina, RD',
        temperature: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + 3),
        condition: currentCondition,
        humidity: 78,
        windSpeed: 15,
        pressure: 1013,
        emoji: getWeatherEmoji(currentCondition, isDay),
        isDay: isDay,
        forecast: [
          { day: 'Mañana', high: 31, low: 24, condition: 'Soleado', emoji: '☀️' },
          { day: 'Pasado', high: 30, low: 23, condition: 'Parcialmente nublado', emoji: '⛅' },
          { day: 'Después', high: 29, low: 23, condition: 'Lluvia ligera', emoji: '🌦️' }
        ]
      }
      
      setWeather(fallbackData)
      setLastUpdate(new Date())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshWeather = () => {
    fetchWeatherData(true)
  }

  useEffect(() => {
    if (!isClient) return
    
    fetchWeatherData()
    
    // Actualizar cada 15 minutos
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchWeatherData(true)
      }
    }, 900000)
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchWeatherData(true)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isClient])

  // Helper para el gradiente de fondo según el clima
  const getBackgroundGradient = () => {
    if (!weather) return 'bg-gradient-to-br from-blue-600 to-blue-800'
    
    const condition = weather.condition.toLowerCase()
    const isDay = weather.isDay
    const hour = new Date().getHours()

    // Tormenta (Prioridad alta)
    if (condition.includes('tormenta') || condition.includes('trueno')) {
      return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }

    // Lluvia
    if (condition.includes('lluvia') || condition.includes('llovizna') || condition.includes('chubasco')) {
      return isDay 
        ? 'bg-gradient-to-br from-slate-700 via-blue-800 to-slate-800' 
        : 'bg-gradient-to-br from-gray-900 via-slate-900 to-black'
    }

    // Nublado
    if (condition.includes('nublado') || condition.includes('cubierto') || condition.includes('nubes')) {
      return isDay
        ? 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700'
        : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
    }

    // Neblina
    if (condition.includes('niebla') || condition.includes('neblina')) {
      return isDay
        ? 'bg-gradient-to-br from-slate-400 via-gray-400 to-slate-500'
        : 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900'
    }

    // Despejado / Soleado
    if (isDay) {
      // Amanecer (6-8 AM)
      if (hour >= 6 && hour <= 8) {
        return 'bg-gradient-to-br from-orange-400 via-rose-400 to-blue-500'
      }
      // Atardecer (5-7 PM)
      if (hour >= 17 && hour <= 19) {
        return 'bg-gradient-to-br from-blue-600 via-orange-500 to-purple-600'
      }
      // Día normal
      return 'bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400'
    } else {
      // Noche despejada
      return 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
    }
  }

  if (!isClient) return null // Evitar hydration mismatch

  if (loading && !weather) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl"></div>
    )
  }

  if (!weather) return null

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation()
    refreshWeather()
  }

  const openProvider = () => {
    window.open('https://www.meteored.do/tiempo-en_Bajos+de+Haina-America+Central-Republica+Dominicana-San+Cristobal--1-23291.html', '_blank')
  }

  return (
    <div 
      onClick={openProvider}
      className={`relative overflow-hidden rounded-xl shadow-lg text-white transition-all duration-500 cursor-pointer hover:shadow-xl transform hover:scale-[1.02] ${getBackgroundGradient()}`}
      title="Ver más en Open-Meteo"
    >
      {/* Decorative circles */}
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

      {/* Header */}
      <div className="relative p-4 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/80" />
          <span className="text-sm font-medium text-white/90">{weather.location}</span>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Weather */}
      <div className="relative px-6 py-2 flex flex-col items-center text-center">
        <div className="text-6xl mb-2 filter drop-shadow-lg animate-in zoom-in duration-300">
          {weather.emoji}
        </div>
        <div className="text-5xl font-bold tracking-tighter mb-1">
          {weather.temperature}°
        </div>
        <div className="text-lg font-medium text-white/90 capitalize">
          {weather.condition}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
          <span>Sensación {weather.feelsLike}°</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="relative px-4 py-4 grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-md">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">Humedad</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-md">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">Viento</p>
            <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="relative bg-black/10 backdrop-blur-md p-4">
        <div className="flex justify-between items-center gap-2">
          {weather.forecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <span className="text-xs font-medium text-white/80 mb-1">{day.day}</span>
              <span className="text-xl mb-1">{day.emoji}</span>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold">{day.high}°</span>
                <span className="text-white/60">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-black/20 text-[10px] text-white/50 text-center flex justify-between items-center">
        <span>OpenMeteo Data</span>
        <span>
          {lastUpdate ? lastUpdate.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
    </div>
  )
}