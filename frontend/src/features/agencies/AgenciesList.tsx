import { useQuery } from '@tanstack/react-query'
import { agenciesApi } from '@/api'
import { Link } from 'react-router-dom'
import { Building2, Phone, Mail, Users, TrendingUp, Clock, Star } from 'lucide-react'
import { getTierBadgeColor } from '@/lib/utils'

export default function AgenciesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agencies', 'my-agencies'],
    queryFn: () => agenciesApi.getMyAgencies(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading agencies...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading agencies</div>
      </div>
    )
  }

  const agencies = data || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Partner Agencies
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {agencies.length} partner agenc{agencies.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {/* Agencies Grid */}
      {agencies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No agencies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No partner agencies available at this time
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agencies.map((agency) => (
            <Link
              key={agency.id}
              to={`/agencies/${agency.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {agency.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {agency.city}, {agency.state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {agency.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {agency.email}
                  </div>
                )}
                {agency.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {agency.phoneNumber}
                  </div>
                )}
                {agency.licenseNumber && (
                  <div className="flex items-center text-xs">
                    License: {agency.licenseNumber}
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Users className="w-4 h-4 mr-1" />
                    Staff Count
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agency.staffCount}
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Fill Rate
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agency.fillRate.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Avg Response
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agency.averageResponseTime.toFixed(1)}h
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Star className="w-4 h-4 mr-1" />
                    Rating
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agency.averageRating > 0
                      ? `⭐ ${agency.averageRating.toFixed(1)}`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Shifts Completed:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {agency.totalShiftsCompleted}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
