import { apiClient } from './client'
import type { UserRole, ApprovalStatus } from '@/types'

export interface UserListDto {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  approvalStatus: ApprovalStatus
  createdAt: string
  corporateName?: string
  facilityName?: string
  agencyName?: string
}

export interface UserDetailsDto extends UserListDto {
  phoneNumber?: string
  approvedBy?: string
  approverName?: string
  approvedAt?: string
  updatedAt?: string
  corporateId?: string
  facilityId?: string
  agencyId?: string
}

export interface ApproveUserRequest {
  notes?: string
}

export interface RejectUserRequest {
  reason: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phoneNumber?: string
  role?: UserRole
  isActive?: boolean
  corporateId?: string
  facilityId?: string
  agencyId?: string
}

export const usersApi = {
  // Get all users with optional filters
  getAllUsers: async (role?: UserRole, status?: ApprovalStatus) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (status) params.append('status', status)

    const { data } = await apiClient.get<UserListDto[]>(`/users?${params.toString()}`)
    return data
  },

  // Get users pending approval
  getPendingApprovals: async () => {
    const { data } = await apiClient.get<UserListDto[]>('/users/pending-approvals')
    return data
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const { data } = await apiClient.get<UserDetailsDto>(`/users/${id}`)
    return data
  },

  // Approve user
  approveUser: async (id: string, request: ApproveUserRequest) => {
    const { data } = await apiClient.post(`/users/${id}/approve`, request)
    return data
  },

  // Reject user
  rejectUser: async (id: string, request: RejectUserRequest) => {
    const { data } = await apiClient.post(`/users/${id}/reject`, request)
    return data
  },

  // Update user
  updateUser: async (id: string, request: UpdateUserRequest) => {
    const { data } = await apiClient.put(`/users/${id}`, request)
    return data
  },

  // Deactivate user
  deactivateUser: async (id: string) => {
    const { data } = await apiClient.post(`/users/${id}/deactivate`)
    return data
  },

  // Activate user
  activateUser: async (id: string) => {
    const { data } = await apiClient.post(`/users/${id}/activate`)
    return data
  },
}
