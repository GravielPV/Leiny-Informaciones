import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()
    
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

    // Validar datos
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password y role son requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    if (!['admin', 'publicista'].includes(role)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
    }

    // Usar cliente administrativo
    const adminSupabase = createAdminClient()

    // Crear usuario usando Admin API
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        role,
        full_name: fullName || email.split('@')[0]
      }
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role,
        created_at: newUser.user.created_at
      }
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}