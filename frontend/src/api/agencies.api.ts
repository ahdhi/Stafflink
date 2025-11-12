import { apiClient } from './client'
import type { Agency, PaginatedResponse } from '@/types'

export const agenciesApi = {
  // Get all agencies
  getAgencies: async (params?: {
    page?: number
    pageSize?: number
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

  // Get my agencies (role-based)
  getMyAgencies: async (): Promise<Agency[]> => {
    const response = await apiClient.get<Agency[]>('/agencies/my-agencies')
    return response.data
  },

  // TODO: Add these endpoints in Phase 3
  // - Create/update agency (SuperAdmin only)
  // - Update agency tier
  // - Get agency performance metrics
  // - Submit shift responses
  // - Decline shift requests
}
