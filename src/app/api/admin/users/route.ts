import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Verificar que el usuario actual es admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar rol de admin
    const userRole = user.user_metadata?.role
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Usar cliente administrativo para operaciones admin
    const adminSupabase = createAdminClient()

    // Obtener todos los usuarios usando la Admin API
    const { data: users, error } = await adminSupabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatear usuarios para el frontend
    const formattedUsers = users.users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'publicista',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}