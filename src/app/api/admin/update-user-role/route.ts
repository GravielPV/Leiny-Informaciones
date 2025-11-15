import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json()
    
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
    if (!userId || !role) {
      return NextResponse.json({ error: 'userId y role son requeridos' }, { status: 400 })
    }

    if (!['admin', 'publicista'].includes(role)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
    }

    // No permitir que un admin se quite sus propios permisos
    if (userId === user.id && role !== 'admin') {
      return NextResponse.json({ error: 'No puedes cambiar tu propio rol de administrador' }, { status: 400 })
    }

    // Usar cliente administrativo
    const adminSupabase = createAdminClient()

    // Actualizar usuario usando Admin API
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}