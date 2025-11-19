export default function AdminLoading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Cargando panel de administración...
        </p>
      </div>
    </div>
  )
}
