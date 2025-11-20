'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AdSetting {
  id: string
  slot_id: string
  type: 'adsense' | 'custom'
  custom_image_url: string | null
  custom_link_url: string | null
  custom_code: string | null
  is_active: boolean
}

interface AdSettingsContextType {
  settings: Record<string, AdSetting>
  loading: boolean
}

const AdSettingsContext = createContext<AdSettingsContextType>({
  settings: {},
  loading: true
})

export function AdSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, AdSetting>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('ad_settings')
          .select('*')

        if (error) {
          console.error('Error fetching ad settings:', error)
          return
        }

        const settingsMap: Record<string, AdSetting> = {}
        data?.forEach(setting => {
          settingsMap[setting.slot_id] = setting
        })

        setSettings(settingsMap)
      } catch (error) {
        console.error('Error in ad settings provider:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  return (
    <AdSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </AdSettingsContext.Provider>
  )
}

export const useAdSettings = () => useContext(AdSettingsContext)
