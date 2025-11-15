import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Simple users API called')
    
    // Usar cliente administrativo directamente
    const adminSupabase = createAdminClient()
    console.log('🔧 Admin client created')

    // Obtener todos los usuarios usando la Admin API
    const { data: users, error } = await adminSupabase.auth.admin.listUsers()
    
    console.log('👥 Users fetched:', users?.users?.length, 'Error:', error?.message)

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

    console.log('✅ Returning users:', formattedUsers.length)

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}