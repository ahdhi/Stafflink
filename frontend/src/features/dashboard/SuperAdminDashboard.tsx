import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { Users, UserCheck, Building2, BarChart3, AlertCircle } from 'lucide-react'
import PendingApprovals from '@/features/superadmin/PendingApprovals'
import AllUsers from '@/features/superadmin/AllUsers'
import CorporateManagement from '@/features/superadmin/CorporateManagement'
import SystemAnalytics from '@/features/superadmin/SystemAnalytics'

type Tab = 'overview' | 'pending' | 'users' | 'corporates' | 'analytics'

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => usersApi.getAllUsers(),
  })

  const { data: pendingUsers } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => usersApi.getPendingApprovals(),
  })

  const stats = {
    totalUsers: allUsers?.length || 0,
    activeUsers: allUsers?.filter((u) => u.isActive).length || 0,
    pendingApprovals: pendingUsers?.length || 0,
    approvedUsers: allUsers?.filter((u) => u.approvalStatus === 'Approved').length || 0,
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pending', label: 'Pending Approvals', icon: AlertCircle, badge: stats.pendingApprovals },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'corporates', label: 'Corporates', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage system users, corporates, and analytics</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Active Users"
                value={stats.activeUsers}
                icon={UserCheck}
                color="green"
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                icon={AlertCircle}
                color="yellow"
              />
              <StatCard
                title="Approved Users"
                value={stats.approvedUsers}
                icon={UserCheck}
                color="purple"
              />
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('pending')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div className="text-left">
                    <p className="font-medium">Review Approvals</p>
                    <p className="text-sm text-gray-600">
                      {stats.pendingApprovals} pending
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-gray-600">{stats.totalUsers} total users</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('corporates')}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                >
                  <Building2 className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Manage Corporates</p>
                    <p className="text-sm text-gray-600">View all corporates</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Pending Approvals Preview */}
            {stats.pendingApprovals > 0 && (
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Pending Approvals</h2>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                <PendingApprovals />
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && <PendingApprovals />}

        {activeTab === 'users' && <AllUsers />}

        {activeTab === 'corporates' && <CorporateManagement />}

        {activeTab === 'analytics' && <SystemAnalytics />}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'purple'
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
