import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { staffApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { User, Phone, Mail, Plus, Award, Clock } from 'lucide-react'

export default function StaffList() {
  const { user } = useAuthStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['staff', 'my-staff'],
    queryFn: () => staffApi.getMyStaff(),
    enabled: user?.role === 'AgencyUser',
  })

  const canCreateStaff = user?.role === 'AgencyUser'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading staff...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading staff</div>
      </div>
    )
  }

  const staff = data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Staff Roster
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {staff.length} staff member{staff.length !== 1 ? 's' : ''}
          </p>
        </div>

        {canCreateStaff && (
          <Link
            to="/staff/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Link>
        )}
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No staff members found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by adding your first staff member
          </p>
          {canCreateStaff && (
            <Link
              to="/staff/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Staff Member
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <Link
              key={member.id}
              to={`/staff/${member.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.professionalType}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.isAvailable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {member.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {member.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                )}
                {member.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phoneNumber}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {member.yearsOfExperience} years experience
                </div>
                {member.specialization && (
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    {member.specialization}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${member.hourlyRate}/hr
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Shifts Completed:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {member.totalShiftsCompleted}
                  </span>
                </div>
                {member.averageRating > 0 && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ⭐ {member.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
