import { apiClient } from './client'
import type {
  Agency,
  AgencyPerformanceMetrics,
  PaginatedResponse,
  StaffProposal,
} from '@/types'

export const agenciesApi = {
  // Get all agencies
  getAgencies: async (params?: {
    page?: number
    pageSize?: number
    tier?: string
    isActive?: boolean
  }): Promise<PaginatedResponse<Agency>> => {
    const response = await apiClient.get<PaginatedResponse<Agency>>('/agencies', {
      params,
    })
    return response.data
  },

  // Get agency by ID
  getAgencyById: async (id: string): Promise<Agency> => {
    const response = await apiClient.get<Agency>(`/agencies/${id}`)
    return response.data
  },

  // Create agency
  createAgency: async (data: Partial<Agency>): Promise<Agency> => {
    const response = await apiClient.post<Agency>('/agencies', data)
    return response.data
  },

  // Update agency
  updateAgency: async (id: string, data: Partial<Agency>): Promise<Agency> => {
    const response = await apiClient.put<Agency>(`/agencies/${id}`, data)
    return response.data
  },

  // Update agency tier
  updateAgencyTier: async (id: string, tier: string): Promise<void> => {
    await apiClient.put(`/agencies/${id}/tier`, { tier })
  },

  // Get agency performance metrics
  getAgencyPerformance: async (
    id: string,
    startDate?: string,
    endDate?: string
  ): Promise<AgencyPerformanceMetrics> => {
    const response = await apiClient.get<AgencyPerformanceMetrics>(
      `/agencies/${id}/performance`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data
  },

  // Get agency staff
  getAgencyStaff: async (id: string): Promise<StaffProposal[]> => {
    const response = await apiClient.get<StaffProposal[]>(`/agencies/${id}/staff`)
    return response.data
  },

  // Submit shift response
  submitShiftResponse: async (
    shiftId: string,
    data: {
      agencyId: string
      proposedStaff: StaffProposal[]
      notes?: string
    }
  ): Promise<void> => {
    await apiClient.post(`/shifts/${shiftId}/responses`, data)
  },

  // Decline shift request
  declineShiftRequest: async (
    shiftId: string,
    data: {
      agencyId: string
      reason: string
    }
  ): Promise<void> => {
    await apiClient.post(`/shifts/${shiftId}/decline`, data)
  },

  // Get agencies by tier
  getAgenciesByTier: async (tier: string): Promise<Agency[]> => {
    const response = await apiClient.get<Agency[]>(`/agencies/tier/${tier}`)
    return response.data
  },
}
