'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ADSENSE_CONFIG } from '@/lib/constants'
import ImageUrlInput from '@/components/admin/ImageUrlInput'
import { Save, Loader2, AlertCircle, CheckCircle, LayoutTemplate, Monitor, Smartphone, MousePointerClick, Code, Image as ImageIcon, ExternalLink } from 'lucide-react'

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
    HOME_HEADER: '728x90px (Horizontal) / 970x250px',
    HOME_SIDEBAR: '300x250px (Rectángulo) / 300x600px',
    ARTICLE_TOP: '728x90px (Horizontal) / 970x90px',
    ARTICLE_BOTTOM: '728x90px (Horizontal) / 300x250px'
  }

  const AD_ICONS: Record<string, React.ReactNode> = {
    HOME_HEADER: <LayoutTemplate className="w-5 h-5" />,
    HOME_SIDEBAR: <Monitor className="w-5 h-5" />,
    ARTICLE_TOP: <Smartphone className="w-5 h-5" />,
    ARTICLE_BOTTOM: <MousePointerClick className="w-5 h-5" />
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Anuncios</h1>
        <p className="text-gray-600 mt-2">Configura y optimiza los espacios publicitarios de tu sitio web.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center shadow-sm border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slots.map(slot => {
          const setting = settings[slot.key]
          if (!setting) return null

          return (
            <div key={slot.key} className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${setting.is_active ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
              {/* Card Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${setting.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                    {AD_ICONS[slot.key] || <LayoutTemplate className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{slot.label}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      {AD_DIMENSIONS[slot.key]}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={setting.is_active}
                      onChange={(e) => updateSetting(slot.key, 'is_active', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Card Body */}
              {setting.is_active && (
                <div className="p-6 space-y-6">
                  {/* Type Selector */}
                  <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateSetting(slot.key, 'type', 'adsense')}
                      className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        setting.type === 'adsense' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-2">G</span> AdSense
                    </button>
                    <button
                      onClick={() => updateSetting(slot.key, 'type', 'custom')}
                      className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        setting.type === 'custom' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Personalizado
                    </button>
                  </div>

                  {/* Configuration Content */}
                  <div className="min-h-[200px]">
                    {setting.type === 'adsense' ? (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full text-yellow-600 shrink-0">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-900">Configuración Automática</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Este espacio mostrará anuncios de Google AdSense usando el ID configurado en el sistema.
                          </p>
                          <div className="mt-2 inline-block px-2 py-1 bg-yellow-100 rounded text-xs font-mono text-yellow-800">
                            ID: {slot.id}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Custom Image Option */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                              Imagen y Enlace
                            </h4>
                          </div>
                          
                          <ImageUrlInput
                            value={setting.custom_image_url || ''}
                            onChange={(url) => updateSetting(slot.key, 'custom_image_url', url)}
                            label=""
                            placeholder="URL de la imagen del banner..."
                          />
                          
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="url"
                              value={setting.custom_link_url || ''}
                              onChange={(e) => updateSetting(slot.key, 'custom_link_url', e.target.value)}
                              placeholder="URL de destino (ej: https://sitio.com)"
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-xs text-gray-400 uppercase tracking-wider">O código HTML</span>
                          </div>
                        </div>

                        {/* Custom Code Option */}
                        <div>
                          <textarea
                            value={setting.custom_code || ''}
                            onChange={(e) => updateSetting(slot.key, 'custom_code', e.target.value)}
                            rows={3}
                            placeholder="<script>...</script>"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-6">
                      {savedSlot === slot.key && (
                        <span className="text-green-600 text-xs font-medium flex items-center animate-in fade-in duration-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Guardado
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSave(slot.key)}
                      disabled={saving === slot.key}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {saving === slot.key ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Guardar
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
