import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { shiftsApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, AlertCircle, Plus } from 'lucide-react'
import type { ShiftStatus } from '@/types'
import { getStatusBadgeColor } from '@/lib/utils'

export default function ShiftsList() {
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ShiftStatus | undefined>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['shifts', 'my-shifts', status],
    queryFn: () => shiftsApi.getMyShifts(status),
  })

  const canCreateShift = user?.role === 'FacilityUser' || user?.role === 'SuperAdmin'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading shifts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading shifts</div>
      </div>
    )
  }

  const shifts = data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Shifts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {shifts.length} shift{shifts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {canCreateShift && (
          <Link
            to="/shifts/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Shift
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status:
          </label>
          <select
            value={status || ''}
            onChange={(e) => setStatus(e.target.value as ShiftStatus || undefined)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="AwaitingApproval">Awaiting Approval</option>
            <option value="Approved">Approved</option>
            <option value="Broadcasting">Broadcasting</option>
            <option value="Assigned">Assigned</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Shifts List */}
      {shifts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No shifts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {status
              ? `No shifts with status "${status}"`
              : 'Get started by creating your first shift'}
          </p>
          {canCreateShift && !status && (
            <Link
              to="/shifts/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Shift
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {shifts.map((shift) => (
            <Link
              key={shift.id}
              to={`/shifts/${shift.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {shift.title}
                    </h3>
                    {shift.isUrgent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {shift.facilityName}
                    </span>
                    <span>{shift.departmentName}</span>
                    <span className="font-medium">{shift.professionalType}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    shift.status
                  )}`}
                >
                  {shift.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(shift.startDateTime).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(shift.startDateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(shift.endDateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${shift.payRate}/hr
                  </div>
                  {shift.assignedStaffName && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Assigned to: {shift.assignedStaffName}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
