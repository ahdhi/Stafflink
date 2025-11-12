import { useQuery } from '@tanstack/react-query'
import { shiftsApi, agenciesApi } from '@/api'
import { Link } from 'react-router-dom'
import { Calendar, Users, Building2, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import { getStatusBadgeColor } from '@/lib/utils'

export default function FacilityUserDashboard() {
  const { data: shifts } = useQuery({
    queryKey: ['shifts', 'my-shifts'],
    queryFn: () => shiftsApi.getMyShifts(),
  })

  const { data: agencies } = useQuery({
    queryKey: ['agencies', 'my-agencies'],
    queryFn: () => agenciesApi.getMyAgencies(),
  })

  const upcomingShifts = shifts?.filter((s) => new Date(s.startDateTime) > new Date()) || []
  const unfilledShifts = shifts?.filter((s) => s.status === 'Broadcasting' || s.status === 'Approved') || []
  const assignedShifts = shifts?.filter((s) => s.status === 'Assigned' || s.status === 'InProgress') || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Facility Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your facility operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Shifts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {shifts?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unfilled Shifts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {unfilledShifts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Assigned Shifts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {assignedShifts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Partner Agencies
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {agencies?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Shifts
            </h2>
            <Link
              to="/shifts"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {upcomingShifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming shifts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShifts.slice(0, 5).map((shift) => (
                <Link
                  key={shift.id}
                  to={`/shifts/${shift.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {shift.title}
                      </h3>
                      {shift.isUrgent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(shift.startDateTime).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(shift.startDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>{shift.professionalType}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        shift.status
                      )}`}
                    >
                      {shift.status}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${shift.payRate}/hr
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Partner Agencies Quick View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Partner Agencies
            </h2>
            <Link
              to="/agencies"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {!agencies || agencies.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No partner agencies</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.slice(0, 6).map((agency) => (
                <Link
                  key={agency.id}
                  to={`/agencies/${agency.id}`}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {agency.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {agency.staffCount} staff
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Fill Rate</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {agency.fillRate.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Rating</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {agency.averageRating > 0
                          ? `⭐ ${agency.averageRating.toFixed(1)}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
