import { apiClient } from './client'
import type { User, PaginatedResponse, ApiResponse } from '@/types'

export interface UserCreateRequest {
  email: string
  name: string
  role: string
  corporateId?: string
  facilityId?: string
  agencyId?: string
  justification?: string
}

export interface UserApprovalRequest {
  userId: string
  approved: boolean
  rejectionReason?: string
}

export const usersApi = {
  // Get all users
  getUsers: async (params?: {
    page?: number
    pageSize?: number
    role?: string
    isApproved?: boolean
    corporateId?: string
  }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params,
    })
    return response.data
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  // Create user request
  createUserRequest: async (data: UserCreateRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users/request', data)
    return response.data
  },

  // Get pending user approvals
  getPendingApprovals: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/pending-approvals')
    return response.data
  },

  // Approve/Reject user
  processUserApproval: async (
    data: UserApprovalRequest
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      '/users/approve',
      data
    )
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data)
    return response.data
  },

  // Deactivate user
  deactivateUser: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/deactivate`)
  },

  // Reactivate user
  reactivateUser: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/reactivate`)
  },

  // Get users by corporate
  getUsersByCorporate: async (corporateId: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(
      `/corporates/${corporateId}/users`
    )
    return response.data
  },

  // Get users by facility
  getUsersByFacility: async (facilityId: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/facilities/${facilityId}/users`)
    return response.data
  },
}
