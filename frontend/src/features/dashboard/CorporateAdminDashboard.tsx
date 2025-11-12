import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { facilitiesApi } from '@/api/facilities'
import { userCreationRequestsApi } from '@/api/userCreationRequests'
import {
  Building2,
  Users,
  FileText,
  BarChart3,
  AlertCircle,
  Plus,
} from 'lucide-react'
import FacilityManagement from '@/features/corporateadmin/FacilityManagement'
import UserRequestManagement from '@/features/corporateadmin/UserRequestManagement'
import CorporateAnalytics from '@/features/corporateadmin/CorporateAnalytics'

type Tab = 'overview' | 'facilities' | 'user-requests' | 'analytics'

export default function CorporateAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const { data: facilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => facilitiesApi.getAllFacilities(),
  })

  const { data: userRequests } = useQuery({
    queryKey: ['user-creation-requests'],
    queryFn: () => userCreationRequestsApi.getAllRequests(),
  })

  const stats = {
    totalFacilities: facilities?.length || 0,
    activeFacilities: facilities?.filter((f) => f.isActive).length || 0,
    totalUsers: facilities?.reduce((sum, f) => sum + f.userCount, 0) || 0,
    pendingRequests: userRequests?.filter((r) => r.approvalStatus === 'Pending').length || 0,
    totalDepartments: facilities?.reduce((sum, f) => sum + f.departmentCount, 0) || 0,
    activeShifts: facilities?.reduce((sum, f) => sum + f.activeShiftCount, 0) || 0,
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'facilities', label: 'Facilities', icon: Building2, badge: stats.totalFacilities },
    {
      id: 'user-requests',
      label: 'User Requests',
      icon: FileText,
      badge: stats.pendingRequests,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Corporate Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your organization's facilities, staff, and operations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Facilities"
                value={stats.totalFacilities}
                subtitle={`${stats.activeFacilities} active`}
                icon={Building2}
                color="blue"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="Across all facilities"
                icon={Users}
                color="green"
              />
              <StatCard
                title="Pending Requests"
                value={stats.pendingRequests}
                subtitle="Awaiting approval"
                icon={AlertCircle}
                color="yellow"
              />
              <StatCard
                title="Departments"
                value={stats.totalDepartments}
                subtitle="Across all facilities"
                icon={Building2}
                color="purple"
              />
              <StatCard
                title="Active Shifts"
                value={stats.activeShifts}
                subtitle="Currently open"
                icon={FileText}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('facilities')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <Building2 className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Manage Facilities</p>
                    <p className="text-sm text-gray-600">
                      {stats.totalFacilities} facilities
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('user-requests')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <Plus className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Request New User</p>
                    <p className="text-sm text-gray-600">Submit user creation request</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-600">Performance insights</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Facility Overview */}
            {facilities && facilities.length > 0 && (
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Facilities</h2>
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilities.slice(0, 6).map((facility) => (
                    <div
                      key={facility.id}
                      className="rounded-lg border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{facility.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            facility.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {facility.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {facility.address}
                        {facility.city && `, ${facility.city}`}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Users</p>
                          <p className="font-semibold">{facility.userCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Departments</p>
                          <p className="font-semibold">{facility.departmentCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Active Shifts</p>
                          <p className="font-semibold">{facility.activeShiftCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'facilities' && <FacilityManagement />}

        {activeTab === 'user-requests' && <UserRequestManagement />}

        {activeTab === 'analytics' && <CorporateAnalytics />}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange'
}

function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
