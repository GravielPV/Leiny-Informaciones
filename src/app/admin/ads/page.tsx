'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ADSENSE_CONFIG } from '@/lib/constants'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface AdSetting {
  id: string
  slot_id: string
  type: 'adsense' | 'custom'
  custom_image_url: string | null
  custom_link_url: string | null
  custom_code: string | null
  is_active: boolean
}

export default function AdsManagerPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Record<string, AdSetting>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [savedSlot, setSavedSlot] = useState<string | null>(null)

  // Definir los slots disponibles basados en la constante
  const slots = Object.keys(ADSENSE_CONFIG.SLOTS).map(key => ({
    key,
    label: key.replace(/_/g, ' '),
    id: ADSENSE_CONFIG.SLOTS[key as keyof typeof ADSENSE_CONFIG.SLOTS]
  }))

  const AD_DIMENSIONS: Record<string, string> = {
    HOME_HEADER: 'Tamaño sugerido: 728x90px (Horizontal) o hasta 970x250px (Billboard)',
    HOME_SIDEBAR: 'Tamaño sugerido: 300x250px (Rectángulo) o 300x600px (Vertical)',
    ARTICLE_TOP: 'Tamaño sugerido: 728x90px (Horizontal) o hasta 970x90px',
    ARTICLE_BOTTOM: 'Tamaño sugerido: 728x90px (Horizontal) o 300x250px (Rectángulo)'
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('ad_settings')
          .select('*')
  
        if (error) throw error
  
        const settingsMap: Record<string, AdSetting> = {}
        
        // Inicializar con valores por defecto si no existen en DB
        // Usamos ADSENSE_CONFIG directamente para evitar dependencias en useEffect
        Object.keys(ADSENSE_CONFIG.SLOTS).forEach(key => {
          const existing = data?.find(d => d.slot_id === key)
          if (existing) {
            settingsMap[key] = existing
          } else {
            settingsMap[key] = {
              id: '', // Se generará al guardar
              slot_id: key,
              type: 'adsense',
              custom_image_url: '',
              custom_link_url: '',
              custom_code: '',
              is_active: true
            }
          }
        })
  
        setSettings(settingsMap)
      } catch (error) {
        console.error('Error fetching ad settings:', error)
        setMessage({ type: 'error', text: 'Error al cargar la configuración de anuncios' })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  const handleSave = async (slotKey: string) => {
    setSaving(slotKey)
    setMessage(null)
    
    try {
      const setting = settings[slotKey]
      
      // Preparar datos para upsert
      const dataToSave = {
        slot_id: setting.slot_id,
        type: setting.type,
        custom_image_url: setting.custom_image_url,
        custom_link_url: setting.custom_link_url,
        custom_code: setting.custom_code,
        is_active: setting.is_active
      }

      const { data, error } = await supabase
        .from('ad_settings')
        .upsert(dataToSave, { onConflict: 'slot_id' })
        .select()
        .single()

      if (error) throw error

      // Actualizar estado local con el ID retornado si era nuevo
      setSettings(prev => ({
        ...prev,
        [slotKey]: { ...prev[slotKey], id: data.id }
      }))

      setMessage({ type: 'success', text: `Configuración de ${slotKey} guardada correctamente` })
      setSavedSlot(slotKey)
    } catch (error) {
      console.error('Error saving ad setting:', error)
      setMessage({ type: 'error', text: 'Error al guardar la configuración' })
    } finally {
      setSaving(null)
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage(null)
        setSavedSlot(null)
      }, 3000)
    }
  }

  const updateSetting = (slotKey: string, field: keyof AdSetting, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [slotKey]: { ...prev[slotKey], [field]: value }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Anuncios</h1>
        <p className="text-gray-600 mt-2">Configura los espacios publicitarios del sitio. Puedes alternar entre Google AdSense y anuncios personalizados.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {slots.map(slot => {
          const setting = settings[slot.key]
          if (!setting) return null

          return (
            <div key={slot.key} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{slot.label}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">Slot ID: {slot.key}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {AD_DIMENSIONS[slot.key]}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={setting.is_active}
                        onChange={(e) => updateSetting(slot.key, 'is_active', e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${setting.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${setting.is_active ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {setting.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </div>
              </div>

              {setting.is_active && (
                <div className="p-6 space-y-6">
                  {/* Selector de Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Anuncio</label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => updateSetting(slot.key, 'type', 'adsense')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          setting.type === 'adsense' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Google AdSense
                      </button>
                      <button
                        onClick={() => updateSetting(slot.key, 'type', 'custom')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          setting.type === 'custom' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Personalizado (Imagen/Link)
                      </button>
                    </div>
                  </div>

                  {/* Configuración AdSense */}
                  {setting.type === 'adsense' && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                      <p className="text-sm text-yellow-800">
                        Se mostrará el bloque de anuncios de Google AdSense configurado en el código.
                        <br />
                        <span className="font-mono text-xs mt-1 block">Ad Unit ID: {slot.id}</span>
                      </p>
                    </div>
                  )}

                  {/* Configuración Personalizada */}
                  {setting.type === 'custom' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Opción A: Imagen + Enlace</h4>
                        <div className="space-y-4">
                          <ImageUrlInput
                            value={setting.custom_image_url || ''}
                            onChange={(url) => updateSetting(slot.key, 'custom_image_url', url)}
                            label="Imagen del Anuncio"
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Enlace de Destino (URL)
                            </label>
                            <input
                              type="url"
                              value={setting.custom_link_url || ''}
                              onChange={(e) => updateSetting(slot.key, 'custom_link_url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white text-sm text-gray-500">O</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Opción B: Código HTML/Script</h4>
                        <p className="text-xs text-gray-500 mb-3">
                          Si ingresas código aquí, tendrá prioridad sobre la imagen. Úsalo para scripts de otras redes publicitarias.
                        </p>
                        <textarea
                          value={setting.custom_code || ''}
                          onChange={(e) => updateSetting(slot.key, 'custom_code', e.target.value)}
                          rows={4}
                          placeholder="<script>...</script> o <div>...</div>"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end items-center space-x-3">
                    {savedSlot === slot.key && (
                      <span className="text-green-600 text-sm font-medium flex items-center animate-in fade-in duration-300">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Guardado correctamente
                      </span>
                    )}
                    <button
                      onClick={() => handleSave(slot.key)}
                      disabled={saving === slot.key}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {saving === slot.key ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
