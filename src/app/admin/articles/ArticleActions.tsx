'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ArticleActionsProps {
  articleId: string
  articleTitle: string
  status?: string
}

export default function ArticleActions({ articleId, articleTitle, status }: ArticleActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          console.log('❌ No hay usuario autenticado')
          setLoading(false)
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('❌ Error obteniendo perfil:', error)
          setLoading(false)
          return
        }

        console.log('✅ Rol de usuario cargado:', profile?.role)
        setUserRole(profile?.role || null)
        setLoading(false)
      } catch (error) {
        console.error('❌ Error en getUserRole:', error)
        setLoading(false)
      }
    }

    getUserRole()
  }, [supabase])

  const canEdit = () => {
    if (loading) return false
    if (!userRole) return false
    
    // Admins pueden editar TODO
    if (userRole === 'admin') return true
    
    // Publicistas solo pueden editar borradores
    if (userRole === 'publicista' && status === 'draft') return true
    
    return false
  }

  const canDelete = () => {
    if (loading) return false
    if (!userRole) return false
    
    // Admins pueden eliminar TODO
    if (userRole === 'admin') return true
    
    // Publicistas solo pueden eliminar borradores
    if (userRole === 'publicista' && status === 'draft') return true
    
    return false
  }

  console.log('🔄 Renderizando ArticleActions:', {
    loading,
    userRole,
    status,
    canEdit: canEdit(),
    canDelete: canDelete()
  })

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        console.error('Error deleting article:', error)
        alert('Error al eliminar el artículo')
      } else {
        // Recargar la página para actualizar la lista
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Error al eliminar el artículo')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (showDeleteConfirm) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-red-600 font-medium">
          ¿Eliminar &quot;{articleTitle.substring(0, 30)}...&quot;?
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded disabled:bg-red-400"
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {canEdit() ? (
        <Link
          href={`/admin/articles/${articleId}/edit`}
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          ✏️ Editar
        </Link>
      ) : (
        <span className="text-gray-400 text-sm">
          ✏️ Sin permisos
        </span>
      )}
      
      {canDelete() ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-600 hover:text-red-900 font-medium"
        >
          🗑️ Eliminar
        </button>
      ) : (
        <span className="text-gray-400 text-sm">
          🗑️ Sin permisos
        </span>
      )}
    </div>
  )
}