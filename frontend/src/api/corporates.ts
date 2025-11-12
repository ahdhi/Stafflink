import { apiClient } from './client'

export interface CorporateDto {
  id: string
  name: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  facilityCount: number
  userCount: number
}

export interface CreateCorporateRequest {
  name: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
}

export interface UpdateCorporateRequest {
  name?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  isActive?: boolean
}

export const corporatesApi = {
  // Get all corporates
  getAllCorporates: async () => {
    const { data } = await apiClient.get<CorporateDto[]>('/corporates')
    return data
  },

  // Get corporate by ID
  getCorporateById: async (id: string) => {
    const { data } = await apiClient.get<CorporateDto>(`/corporates/${id}`)
    return data
  },

  // Create corporate
  createCorporate: async (request: CreateCorporateRequest) => {
    const { data } = await apiClient.post<CorporateDto>('/corporates', request)
    return data
  },

  // Update corporate
  updateCorporate: async (id: string, request: UpdateCorporateRequest) => {
    const { data } = await apiClient.put(`/corporates/${id}`, request)
    return data
  },

  // Delete corporate
  deleteCorporate: async (id: string) => {
    const { data } = await apiClient.delete(`/corporates/${id}`)
    return data
  },
}
