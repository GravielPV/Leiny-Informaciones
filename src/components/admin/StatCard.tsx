import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50', 
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50'
  }

  const changeClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  // Extract background and text color for the icon container
  const [, textIcon, bgContainer] = colorClasses[color].split(' ')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 ${bgContainer} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${textIcon}`} />
        </div>
      </div>
    </div>
  )
}
