import { apiClient } from './client'
import type { Staff, StaffCreateRequest, PaginatedResponse } from '@/types'

export const staffApi = {
  // Get all staff
  getStaff: async (params?: {
    page?: number
    pageSize?: number
    agencyId?: string
    professionalType?: string
    isAvailable?: boolean
  }): Promise<PaginatedResponse<Staff>> => {
    const response = await apiClient.get<PaginatedResponse<Staff>>('/staff', {
      params,
    })
    return response.data
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<Staff> => {
    const response = await apiClient.get<Staff>(`/staff/${id}`)
    return response.data
  },

  // Get my staff (agency users)
  getMyStaff: async (): Promise<Staff[]> => {
    const response = await apiClient.get<Staff[]>('/staff/my-staff')
    return response.data
  },

  // Create staff
  createStaff: async (data: StaffCreateRequest): Promise<Staff> => {
    const response = await apiClient.post<Staff>('/staff', data)
    return response.data
  },

  // Update staff
  updateStaff: async (id: string, data: StaffCreateRequest): Promise<Staff> => {
    const response = await apiClient.put<Staff>(`/staff/${id}`, data)
    return response.data
  },

  // Delete staff
  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`)
  },

  // TODO: Add these endpoints in Phase 3
  // - Get staff availability
  // - Add/update/delete availability
  // - Get staff certifications
  // - Add/verify certifications
}
