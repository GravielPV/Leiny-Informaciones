import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
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
    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    // No permitir que un admin se elimine a sí mismo
    if (userId === user.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 })
    }

    // Usar cliente administrativo
    const adminSupabase = createAdminClient()

    // Eliminar usuario usando Admin API
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}