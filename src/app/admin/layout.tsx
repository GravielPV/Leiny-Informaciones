import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { MobileSidebar } from '@/components/admin/MobileSidebar'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Tags, 
  LogOut,
  ExternalLink,
  HelpCircle,
  Play,
  Megaphone
} from 'lucide-react'

// Componente para el contenido del sidebar
function SidebarContent({ user }: { user: { email?: string; role?: string | null } }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <Image 
          src="/logo2.jpg" 
          alt="Logo" 
          width={32}
          height={32}
          className="h-8 w-8 rounded"
        />
        <div className="ml-3">
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
          <p className="text-blue-100 text-xs">Las Informaciones</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8">
        <div className="px-4 space-y-2">
          <Link 
            href="/admin"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Dashboard
          </Link>

          <Link 
            href="/admin/articles"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Artículos
          </Link>

          <Link 
            href="/admin/users"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Users className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Usuarios
          </Link>

          <Link 
            href="/admin/categories"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Tags className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Categorías
          </Link>

          <Link 
            href="/admin/live-videos"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Play className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Videos en Vivo
          </Link>

          <Link 
            href="/admin/ads"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Megaphone className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Edición Anuncio
          </Link>
        </div>
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role}
            </p>
          </div>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithRole()

  // Solo redirigir si no hay sesión
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent user={user} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar>
        <SidebarContent user={user} />
      </MobileSidebar>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:ml-0 ml-0">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center lg:ml-0 ml-14">
                <h2 className="text-xl font-semibold text-gray-900">Panel de Administración</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  target="_blank"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center"
                >
                  Ver Sitio Web
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}