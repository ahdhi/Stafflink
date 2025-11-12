import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { Search, UserCheck, UserX, Edit } from 'lucide-react'
import { toast } from 'sonner'
import type { UserRole, ApprovalStatus } from '@/types'

export default function AllUsers() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | ''>('')

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users', roleFilter, statusFilter],
    queryFn: () =>
      usersApi.getAllUsers(
        roleFilter || undefined,
        statusFilter || undefined
      ),
  })

  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      toast.success('User deactivated')
    },
    onError: () => {
      toast.error('Failed to deactivate user')
    },
  })

  const activateMutation = useMutation({
    mutationFn: (userId: string) => usersApi.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      toast.success('User activated')
    },
    onError: () => {
      toast.error('Failed to activate user')
    },
  })

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-purple-100 text-purple-800'
      case 'CorporateAdmin':
        return 'bg-blue-100 text-blue-800'
      case 'FacilityUser':
        return 'bg-green-100 text-green-800'
      case 'AgencyUser':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Users</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border px-10 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
          className="rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="SuperAdmin">Super Admin</option>
          <option value="CorporateAdmin">Corporate Admin</option>
          <option value="FacilityUser">Facility User</option>
          <option value="AgencyUser">Agency User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApprovalStatus | '')}
          className="rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-4">Loading users...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Active
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(
                        user.approvalStatus
                      )}`}
                    >
                      {user.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.corporateName || user.facilityName || user.agencyName || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <span className="text-xs text-green-600">Active</span>
                    ) : (
                      <span className="text-xs text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.isActive ? (
                        <button
                          onClick={() => {
                            if (confirm('Deactivate this user?')) {
                              deactivateMutation.mutate(user.id)
                            }
                          }}
                          disabled={deactivateMutation.isPending}
                          className="rounded bg-red-50 p-1.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          title="Deactivate"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (confirm('Activate this user?')) {
                              activateMutation.mutate(user.id)
                            }
                          }}
                          disabled={activateMutation.isPending}
                          className="rounded bg-green-50 p-1.5 text-green-600 hover:bg-green-100 disabled:opacity-50"
                          title="Activate"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers?.length === 0 && (
            <div className="p-8 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold">{users?.length || 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {users?.filter((u) => u.isActive).length || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600">
            {users?.filter((u) => u.approvalStatus === 'Pending').length || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Inactive Users</p>
          <p className="text-2xl font-bold text-red-600">
            {users?.filter((u) => !u.isActive).length || 0}
          </p>
        </div>
      </div>
    </div>
  )
}
