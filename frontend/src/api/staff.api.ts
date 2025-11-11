import { apiClient } from './client'
import type { Staff, Availability, Certification, PaginatedResponse } from '@/types'

export const staffApi = {
  // Get all staff
  getStaff: async (params?: {
    page?: number
    pageSize?: number
    agencyId?: string
    role?: string
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

  // Create staff
  createStaff: async (data: Partial<Staff>): Promise<Staff> => {
    const response = await apiClient.post<Staff>('/staff', data)
    return response.data
  },

  // Update staff
  updateStaff: async (id: string, data: Partial<Staff>): Promise<Staff> => {
    const response = await apiClient.put<Staff>(`/staff/${id}`, data)
    return response.data
  },

  // Delete staff
  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`)
  },

  // Get staff availability
  getStaffAvailability: async (
    staffId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Availability[]> => {
    const response = await apiClient.get<Availability[]>(
      `/staff/${staffId}/availability`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data
  },

  // Add staff availability
  addAvailability: async (data: Partial<Availability>): Promise<Availability> => {
    const response = await apiClient.post<Availability>('/staff/availability', data)
    return response.data
  },

  // Update availability
  updateAvailability: async (
    id: string,
    data: Partial<Availability>
  ): Promise<Availability> => {
    const response = await apiClient.put<Availability>(
      `/staff/availability/${id}`,
      data
    )
    return response.data
  },

  // Delete availability
  deleteAvailability: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/availability/${id}`)
  },

  // Get staff certifications
  getStaffCertifications: async (staffId: string): Promise<Certification[]> => {
    const response = await apiClient.get<Certification[]>(
      `/staff/${staffId}/certifications`
    )
    return response.data
  },

  // Add certification
  addCertification: async (
    staffId: string,
    data: Partial<Certification>
  ): Promise<Certification> => {
    const response = await apiClient.post<Certification>(
      `/staff/${staffId}/certifications`,
      data
    )
    return response.data
  },

  // Verify certification
  verifyCertification: async (certificationId: string): Promise<void> => {
    await apiClient.post(`/staff/certifications/${certificationId}/verify`)
  },
}
