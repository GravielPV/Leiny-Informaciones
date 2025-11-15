import { createClient } from '@/lib/supabase/server'

export async function getUserRole(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    // Intentar obtener rol de user_metadata
    if (user.user_metadata?.role) {
      return user.user_metadata.role
    }
    
    // Fallback: intentar obtener de la tabla profiles si existe
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      return profile?.role || 'publicista'
    } catch {
      // Si la tabla no existe, usar valor por defecto
      return 'publicista'
    }
  } catch {
    return null
  }
}

export async function isUserAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

export async function getUserWithRole() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const role = await getUserRole()
    
    return {
      ...user,
      role
    }
  } catch {
    return null
  }
}