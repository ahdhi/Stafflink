import { useQuery } from '@tanstack/react-query'
import { facilitiesApi } from '@/api/facilities'
import { userCreationRequestsApi } from '@/api/userCreationRequests'
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
} from 'lucide-react'

export default function CorporateAnalytics() {
  const { data: facilities, isLoading: facilitiesLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => facilitiesApi.getAllFacilities(),
  })

  const { data: userRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['user-creation-requests'],
    queryFn: () => userCreationRequestsApi.getAllRequests(),
  })

  if (facilitiesLoading || requestsLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  const totalFacilities = facilities?.length || 0
  const activeFacilities = facilities?.filter((f) => f.isActive).length || 0
  const totalUsers = facilities?.reduce((sum, f) => sum + f.userCount, 0) || 0
  const totalDepartments = facilities?.reduce((sum, f) => sum + f.departmentCount, 0) || 0
  const totalActiveShifts = facilities?.reduce((sum, f) => sum + f.activeShiftCount, 0) || 0

  const avgUsersPerFacility = totalFacilities > 0 ? (totalUsers / totalFacilities).toFixed(1) : '0'
  const avgDepartmentsPerFacility =
    totalFacilities > 0 ? (totalDepartments / totalFacilities).toFixed(1) : '0'
  const avgShiftsPerFacility =
    totalFacilities > 0 ? (totalActiveShifts / totalFacilities).toFixed(1) : '0'

  const pendingRequests = userRequests?.filter((r) => r.approvalStatus === 'Pending').length || 0
  const approvedRequests = userRequests?.filter((r) => r.approvalStatus === 'Approved').length || 0
  const rejectedRequests = userRequests?.filter((r) => r.approvalStatus === 'Rejected').length || 0
  const approvalRate =
    approvedRequests + rejectedRequests > 0
      ? ((approvedRequests / (approvedRequests + rejectedRequests)) * 100).toFixed(1)
      : '0'

  // Sort facilities by various metrics
  const facilitiesByUsers = [...(facilities || [])].sort((a, b) => b.userCount - a.userCount)
  const facilitiesByShifts = [...(facilities || [])].sort(
    (a, b) => b.activeShiftCount - a.activeShiftCount
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Corporate Analytics</h2>
        <p className="text-gray-600 mt-1">Performance insights across all facilities</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Facilities"
          value={totalFacilities}
          subtitle={`${activeFacilities} active`}
          icon={Building2}
          trend={activeFacilities === totalFacilities ? 'up' : 'neutral'}
        />
        <MetricCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${avgUsersPerFacility} avg per facility`}
          icon={Users}
          trend="neutral"
        />
        <MetricCard
          title="Active Shifts"
          value={totalActiveShifts}
          subtitle={`${avgShiftsPerFacility} avg per facility`}
          icon={Activity}
          trend="neutral"
        />
        <MetricCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          subtitle={`${approvedRequests} approved, ${rejectedRequests} rejected`}
          icon={TrendingUp}
          trend={Number(approvalRate) >= 80 ? 'up' : Number(approvalRate) >= 50 ? 'neutral' : 'down'}
        />
      </div>

      {/* Facility Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Facilities by Users */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Top Facilities by Users</h3>
          </div>
          <div className="space-y-3">
            {facilitiesByUsers.slice(0, 5).map((facility, index) => (
              <div key={facility.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{facility.name}</p>
                    <p className="text-xs text-gray-500">
                      {facility.city && `${facility.city}, `}
                      {facility.state}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{facility.userCount}</p>
                  <p className="text-xs text-gray-500">users</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Facilities by Active Shifts */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Top Facilities by Active Shifts</h3>
          </div>
          <div className="space-y-3">
            {facilitiesByShifts.slice(0, 5).map((facility, index) => (
              <div key={facility.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{facility.name}</p>
                    <p className="text-xs text-gray-500">
                      {facility.city && `${facility.city}, `}
                      {facility.state}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{facility.activeShiftCount}</p>
                  <p className="text-xs text-gray-500">shifts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Facility Comparison Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">All Facilities Comparison</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Shifts
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facilities?.map((facility) => {
                const utilizationScore =
                  facility.userCount > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (facility.activeShiftCount / facility.userCount) * 100
                        )
                      )
                    : 0

                return (
                  <tr key={facility.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {facility.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {facility.city && `${facility.city}, `}
                          {facility.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          facility.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {facility.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {facility.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {facility.departmentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {facility.activeShiftCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              utilizationScore >= 75
                                ? 'bg-green-500'
                                : utilizationScore >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${utilizationScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10">
                          {utilizationScore}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Request Analytics */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">User Request Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-3xl font-bold">{userRequests?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedRequests}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejectedRequests}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend: 'up' | 'down' | 'neutral'
}

function MetricCard({ title, value, subtitle, icon: Icon, trend }: MetricCardProps) {
  const trendIcon =
    trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : null

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-start justify-between mb-2">
        <Icon className="h-8 w-8 text-gray-400" />
        {trendIcon}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}