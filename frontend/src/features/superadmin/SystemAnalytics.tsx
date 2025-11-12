import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { corporatesApi } from '@/api/corporates'
import {
  Users,
  Building2,
  UserCheck,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
} from 'lucide-react'

export default function SystemAnalytics() {
  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => usersApi.getAllUsers(),
  })

  const { data: corporates } = useQuery({
    queryKey: ['corporates'],
    queryFn: () => corporatesApi.getAllCorporates(),
  })

  const analytics = {
    totalUsers: allUsers?.length || 0,
    activeUsers: allUsers?.filter((u) => u.isActive).length || 0,
    pendingUsers: allUsers?.filter((u) => u.approvalStatus === 'Pending').length || 0,
    approvedUsers: allUsers?.filter((u) => u.approvalStatus === 'Approved').length || 0,
    rejectedUsers: allUsers?.filter((u) => u.approvalStatus === 'Rejected').length || 0,
    totalCorporates: corporates?.length || 0,
    activeCorporates: corporates?.filter((c) => c.isActive).length || 0,
    totalFacilities: corporates?.reduce((sum, c) => sum + c.facilityCount, 0) || 0,
    avgFacilitiesPerCorporate:
      corporates && corporates.length > 0
        ? (corporates.reduce((sum, c) => sum + c.facilityCount, 0) / corporates.length).toFixed(1)
        : 0,
    avgUsersPerCorporate:
      corporates && corporates.length > 0
        ? (corporates.reduce((sum, c) => sum + c.userCount, 0) / corporates.length).toFixed(1)
        : 0,
  }

  // Role distribution
  const roleDistribution = [
    {
      role: 'Super Admin',
      count: allUsers?.filter((u) => u.role === 'SuperAdmin').length || 0,
      color: 'bg-purple-500',
    },
    {
      role: 'Corporate Admin',
      count: allUsers?.filter((u) => u.role === 'CorporateAdmin').length || 0,
      color: 'bg-blue-500',
    },
    {
      role: 'Facility User',
      count: allUsers?.filter((u) => u.role === 'FacilityUser').length || 0,
      color: 'bg-green-500',
    },
    {
      role: 'Agency User',
      count: allUsers?.filter((u) => u.role === 'AgencyUser').length || 0,
      color: 'bg-orange-500',
    },
  ]

  // Approval status distribution
  const approvalDistribution = [
    {
      status: 'Approved',
      count: analytics.approvedUsers,
      color: 'bg-green-500',
    },
    {
      status: 'Pending',
      count: analytics.pendingUsers,
      color: 'bg-yellow-500',
    },
    {
      status: 'Rejected',
      count: analytics.rejectedUsers,
      color: 'bg-red-500',
    },
  ]

  const maxRoleCount = Math.max(...roleDistribution.map((r) => r.count), 1)
  const maxApprovalCount = Math.max(...approvalDistribution.map((a) => a.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">System Analytics</h2>
        <p className="text-gray-600 mt-1">Comprehensive system-wide metrics and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="blue"
          subtitle="All users in system"
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={UserCheck}
          color="green"
          subtitle={`${((analytics.activeUsers / analytics.totalUsers) * 100 || 0).toFixed(0)}% of total`}
        />
        <MetricCard
          title="Total Corporates"
          value={analytics.totalCorporates}
          icon={Building2}
          color="purple"
          subtitle={`${analytics.activeCorporates} active`}
        />
        <MetricCard
          title="Total Facilities"
          value={analytics.totalFacilities}
          icon={Activity}
          color="orange"
          subtitle={`Avg ${analytics.avgFacilitiesPerCorporate} per corporate`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">User Role Distribution</h3>
          </div>
          <div className="space-y-3">
            {roleDistribution.map((role) => (
              <div key={role.role}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{role.role}</span>
                  <span className="text-sm text-gray-600">{role.count}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${role.color}`}
                    style={{
                      width: `${(role.count / maxRoleCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Status Distribution */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Approval Status</h3>
          </div>
          <div className="space-y-3">
            {approvalDistribution.map((approval) => (
              <div key={approval.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{approval.status}</span>
                  <span className="text-sm text-gray-600">{approval.count}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${approval.color}`}
                    style={{
                      width: `${(approval.count / maxApprovalCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">System Health Indicators</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">User Approval Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {((analytics.approvedUsers / analytics.totalUsers) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.approvedUsers} of {analytics.totalUsers} users approved
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Active User Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {((analytics.activeUsers / analytics.totalUsers) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.activeUsers} of {analytics.totalUsers} users active
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Pending Approval Rate</p>
            <p className="text-2xl font-bold text-yellow-600">
              {((analytics.pendingUsers / analytics.totalUsers) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.pendingUsers} users awaiting approval
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Insights */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Corporate Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{analytics.totalCorporates}</p>
            <p className="text-sm text-gray-600 mt-1">Total Corporates</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{analytics.totalFacilities}</p>
            <p className="text-sm text-gray-600 mt-1">Total Facilities</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{analytics.avgFacilitiesPerCorporate}</p>
            <p className="text-sm text-gray-600 mt-1">Avg Facilities/Corporate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{analytics.avgUsersPerCorporate}</p>
            <p className="text-sm text-gray-600 mt-1">Avg Users/Corporate</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange'
  subtitle: string
}

function MetricCard({ title, value, icon: Icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}
