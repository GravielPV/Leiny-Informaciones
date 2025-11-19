interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }

  const statusLabels = {
    published: 'Publicado',
    draft: 'Borrador',
    archived: 'Archivado'
  }

  const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  const label = statusLabels[status as keyof typeof statusLabels] || status

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
