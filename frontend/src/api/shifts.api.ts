import { apiClient } from './client'
import type {
  Shift,
  ShiftCreateRequest,
  ShiftStatus,
  PaginatedResponse,
  AgencyTier,
} from '@/types'

export const shiftsApi = {
  // Get all shifts with filters
  getShifts: async (params?: {
    page?: number
    pageSize?: number
    status?: ShiftStatus
    facilityId?: string
    departmentId?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<Shift>> => {
    const response = await apiClient.get<PaginatedResponse<Shift>>('/shifts', {
      params,
    })
    return response.data
  },

  // Get shift by ID
  getShiftById: async (id: string): Promise<Shift> => {
    const response = await apiClient.get<Shift>(`/shifts/${id}`)
    return response.data
  },

  // Get my shifts (role-based)
  getMyShifts: async (status?: ShiftStatus): Promise<Shift[]> => {
    const response = await apiClient.get<Shift[]>('/shifts/my-shifts', {
      params: { status },
    })
    return response.data
  },

  // Create shift
  createShift: async (data: ShiftCreateRequest): Promise<Shift> => {
    const response = await apiClient.post<Shift>('/shifts', data)
    return response.data
  },

  // Update shift
  updateShift: async (id: string, data: Partial<ShiftCreateRequest>): Promise<Shift> => {
    const response = await apiClient.put<Shift>(`/shifts/${id}`, data)
    return response.data
  },

  // Delete shift
  deleteShift: async (id: string): Promise<void> => {
    await apiClient.delete(`/shifts/${id}`)
  },

  // Broadcast shift to agencies
  broadcastShift: async (
    shiftId: string,
    data?: {
      specificAgencyIds?: string[]
      startFromTier?: AgencyTier
    }
  ): Promise<Shift> => {
    const response = await apiClient.post<Shift>(`/shifts/${shiftId}/broadcast`, data || {})
    return response.data
  },

  // Assign staff to shift
  assignStaff: async (shiftId: string, staffId: string): Promise<Shift> => {
    const response = await apiClient.post<Shift>(`/shifts/${shiftId}/assign`, { staffId })
    return response.data
  },
}
