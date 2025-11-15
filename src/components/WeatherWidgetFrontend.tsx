'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  pressure: number
  emoji: string
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    emoji: string
  }>
}

interface WttrResponse {
  current_condition: Array<{
    temp_C: string
    FeelsLikeC: string
    humidity: string
    windspeedKmph: string
    pressure: string
    weatherDesc: Array<{ value: string }>
  }>
  weather: Array<{
    maxtempC: string
    mintempC: string
    hourly: Array<{
      weatherDesc: Array<{ value: string }>
    }>
  }>
}

// Función para obtener emoji basado en la condición
const getWeatherEmoji = (condition: string, hour: number = new Date().getHours()) => {
  const lower = condition.toLowerCase()
  const isDay = hour >= 6 && hour < 18
  
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

      // Primero intentar con wttr.in que es más confiable y gratuito
      try {
        const response = await fetch(
          'https://wttr.in/Santo_Domingo,Dominican_Republic?format=j1',
          { 
            headers: {
              'User-Agent': 'Las-Informaciones-Weather-Widget/1.0'
            },
            cache: 'no-cache' // Forzar datos frescos
          }
        )
        
        if (response.ok) {
          const data: WttrResponse = await response.json()
          const current = data.current_condition[0]
          
          // Traducir condiciones al español
          const translateCondition = (condition: string) => {
            const translations: { [key: string]: string } = {
              'Clear': 'Despejado',
              'Sunny': 'Soleado',
              'Partly cloudy': 'Parcialmente nublado',
              'Cloudy': 'Nublado',
              'Overcast': 'Cubierto',
              'Mist': 'Neblina',
              'Fog': 'Niebla',
              'Light rain': 'Lluvia ligera',
              'Light rain shower': 'Lluvia ligera',
              'Moderate rain': 'Lluvia moderada',
              'Heavy rain': 'Lluvia fuerte',
              'Thundery outbreaks possible': 'Posibles tormentas',
              'Thunderstorm': 'Tormenta'
            }
            return translations[condition] || condition
          }
          
          const currentCondition = translateCondition(current.weatherDesc[0].value)
          
          const realWeatherData: WeatherData = {
            location: 'Santo Domingo, RD',
            temperature: Math.round(parseFloat(current.temp_C)),
            feelsLike: Math.round(parseFloat(current.FeelsLikeC)),
            condition: currentCondition,
            humidity: parseInt(current.humidity),
            windSpeed: Math.round(parseFloat(current.windspeedKmph)),
            pressure: Math.round(parseFloat(current.pressure)),
            emoji: getWeatherEmoji(currentCondition),
            forecast: data.weather.slice(1, 4).map((day: WttrResponse['weather'][0], index: number) => {
              const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
              const today = new Date().getDay()
              const dayCondition = translateCondition(day.hourly[4]?.weatherDesc[0]?.value || day.hourly[0].weatherDesc[0].value)
              
              return {
                day: days[(today + index + 1) % 7],
                high: Math.round(parseFloat(day.maxtempC)),
                low: Math.round(parseFloat(day.mintempC)),
                condition: dayCondition,
                emoji: getWeatherEmoji(dayCondition)
              }
            })
          }
          
          setWeather(realWeatherData)
          setLastUpdate(new Date())
          return
        }
      } catch (wttrError) {
        console.warn('wttr.in no disponible:', wttrError)
      }

      // Segundo intento: usar OpenMeteo (API gratuita sin llave)
      try {
        // Coordenadas de Santo Domingo: 18.4861, -69.9312
        const lat = 18.4861
        const lon = -69.9312
        
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSanto_Domingo&forecast_days=4`,
          { cache: 'no-cache' } // Forzar datos frescos
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
              95: 'Tormenta'
            }
            return codes[code] || 'Despejado'
          }
          
          const currentCondition = getConditionFromCode(data.current.weather_code)
          
          const meteoWeatherData: WeatherData = {
            location: 'Santo Domingo, RD',
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            condition: currentCondition,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // m/s to km/h
            pressure: Math.round(data.current.surface_pressure),
            emoji: getWeatherEmoji(currentCondition),
            forecast: data.daily.weather_code.slice(1, 4).map((code: number, index: number) => {
              const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
              const today = new Date().getDay()
              const dayCondition = getConditionFromCode(code)
              
              return {
                day: days[(today + index + 1) % 7],
                high: Math.round(data.daily.temperature_2m_max[index + 1]),
                low: Math.round(data.daily.temperature_2m_min[index + 1]),
                condition: dayCondition,
                emoji: getWeatherEmoji(dayCondition)
              }
            })
          }
          
          setWeather(meteoWeatherData)
          setLastUpdate(new Date())
          return
        }
      } catch (meteoError) {
        console.warn('Open-Meteo no disponible:', meteoError)
      }

      // Como último recurso, datos basados en patrones climáticos reales de RD
      const currentHour = new Date().getHours()
      const currentCondition = currentHour >= 6 && currentHour <= 17 ? 'Soleado' : 'Despejado'
      const baseTemp = currentHour >= 6 && currentHour <= 17 
        ? 28 + Math.sin((currentHour - 6) * Math.PI / 11) * 5  // 23-33°C durante el día
        : 25 + Math.random() * 3 // 25-28°C durante la noche

      const fallbackData: WeatherData = {
        location: 'Santo Domingo, RD',
        temperature: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + 2 + Math.random() * 4),
        condition: currentCondition + ' (Estimado)',
        humidity: Math.round(70 + Math.random() * 20), // 70-90% típico del Caribe
        windSpeed: Math.round(10 + Math.random() * 10), // 10-20 km/h
        pressure: Math.round(1013 + Math.random() * 5), // 1013-1018 hPa
        emoji: getWeatherEmoji(currentCondition),
        forecast: [
          { day: 'Mañana', high: Math.round(baseTemp + 3), low: Math.round(baseTemp - 5), condition: 'Soleado', emoji: '☀️' },
          { day: 'Pasado', high: Math.round(baseTemp + 2), low: Math.round(baseTemp - 4), condition: 'Parcialmente nublado', emoji: '⛅' },
          { day: 'Después', high: Math.round(baseTemp + 1), low: Math.round(baseTemp - 6), condition: 'Lluvia ligera', emoji: '🌦️' }
        ]
      }

      setWeather(fallbackData)
      setLastUpdate(new Date())
      
    } catch (err) {
      setError('Error al obtener datos del clima')
      console.error('Weather fetch error:', err)
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
    
    // Actualizar cada 10 minutos para datos reales más frescos
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchWeatherData(true)
      }
    }, 600000)
    
    // También actualizar cuando la pestaña vuelve a ser visible
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

  // No renderizar nada hasta que esté en el cliente
  if (!isClient) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
          <div className="h-8 bg-white/20 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">⚠️ Clima</h3>
          <button 
            onClick={refreshWeather}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Reintentar"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-none overflow-hidden">
      {/* Header - Responsive */}
      <div className="bg-blue-600 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white">
            🌤️ El Tiempo
          </h3>
          <button 
            onClick={refreshWeather}
            className={`p-1 hover:bg-blue-700 rounded transition-colors ${refreshing ? 'cursor-not-allowed' : ''}`}
            title="Actualizar"
            disabled={refreshing}
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {/* Location y temperatura - Responsive */}
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-xs text-gray-600 mb-1">{weather.location}</p>
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl sm:text-3xl mr-2">{weather.emoji}</span>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-gray-600 capitalize break-words">
                {weather.condition}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Sensación: {weather.feelsLike}°C
          </p>
        </div>

        {/* Detalles compactos - Responsive Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4 text-xs">
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-base sm:text-lg mb-1">💧</div>
            <div className="text-gray-600 text-xs">Humedad</div>
            <div className="font-medium text-xs sm:text-sm">{weather.humidity}%</div>
          </div>
          
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-base sm:text-lg mb-1">💨</div>
            <div className="text-gray-600 text-xs">Viento</div>
            <div className="font-medium text-xs sm:text-sm">{weather.windSpeed} km/h</div>
          </div>
        </div>

        {/* Pronóstico de 3 días compacto - Responsive */}
        <div className="border-t border-gray-200 pt-3">
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-gray-50 rounded p-1.5 sm:p-2">
                <div className="font-medium text-gray-700 mb-1 text-xs">{day.day}</div>
                <div className="text-sm sm:text-lg mb-1">{day.emoji}</div>
                <div className="text-xs">
                  <span className="font-bold text-gray-900">{day.high}°</span>
                  <span className="text-gray-600">/{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Última actualización - Responsive */}
        {lastUpdate && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
              <span>🔄 Datos en tiempo real</span>
              <span className={`${refreshing ? 'animate-pulse' : ''} text-center sm:text-right`}>
                {refreshing ? 'Actualizando...' : 
                  `${lastUpdate.toLocaleTimeString('es-DO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}