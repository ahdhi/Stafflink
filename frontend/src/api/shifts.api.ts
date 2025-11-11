import { apiClient } from './client'
import type {
  Shift,
  ShiftCreateRequest,
  ShiftBroadcastRequest,
  AgencyResponse,
  PaginatedResponse,
  ApiResponse,
} from '@/types'

export const shiftsApi = {
  // Get all shifts with filters
  getShifts: async (params?: {
    page?: number
    pageSize?: number
    status?: string
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

  // Cancel shift
  cancelShift: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/shifts/${id}/cancel`, { reason })
  },

  // Broadcast shift to agencies
  broadcastShift: async (data: ShiftBroadcastRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/shifts/${data.shiftId}/broadcast`,
      data
    )
    return response.data
  },

  // Get agency responses for a shift
  getShiftResponses: async (shiftId: string): Promise<AgencyResponse[]> => {
    const response = await apiClient.get<AgencyResponse[]>(
      `/shifts/${shiftId}/responses`
    )
    return response.data
  },

  // Accept agency response
  acceptResponse: async (shiftId: string, responseId: string): Promise<void> => {
    await apiClient.post(`/shifts/${shiftId}/responses/${responseId}/accept`)
  },

  // Bulk create shifts
  bulkCreateShifts: async (shifts: ShiftCreateRequest[]): Promise<Shift[]> => {
    const response = await apiClient.post<Shift[]>('/shifts/bulk', shifts)
    return response.data
  },

  // Get shifts by facility
  getShiftsByFacility: async (
    facilityId: string,
    params?: {
      startDate?: string
      endDate?: string
      status?: string
    }
  ): Promise<Shift[]> => {
    const response = await apiClient.get<Shift[]>(
      `/facilities/${facilityId}/shifts`,
      { params }
    )
    return response.data
  },

  // Get unfilled shifts
  getUnfilledShifts: async (params?: {
    facilityId?: string
    priority?: string
  }): Promise<Shift[]> => {
    const response = await apiClient.get<Shift[]>('/shifts/unfilled', { params })
    return response.data
  },
}
