import { apiClient } from './client'

export interface FacilityDto {
  id: string
  name: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  isActive: boolean
  corporateId?: string
  corporateName?: string
  createdAt: string
  updatedAt?: string
  departmentCount: number
  userCount: number
  activeShiftCount: number
}

export interface CreateFacilityRequest {
  name: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  corporateId?: string
}

export interface UpdateFacilityRequest {
  name?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  isActive?: boolean
  corporateId?: string
}

export const facilitiesApi = {
  // Get all facilities
  getAllFacilities: async () => {
    const { data } = await apiClient.get<FacilityDto[]>('/facilities')
    return data
  },

  // Get facility by ID
  getFacilityById: async (id: string) => {
    const { data } = await apiClient.get<FacilityDto>(`/facilities/${id}`)
    return data
  },

  // Create facility
  createFacility: async (request: CreateFacilityRequest) => {
    const { data } = await apiClient.post<FacilityDto>('/facilities', request)
    return data
  },

  // Update facility
  updateFacility: async (id: string, request: UpdateFacilityRequest) => {
    const { data } = await apiClient.put(`/facilities/${id}`, request)
    return data
  },

  // Delete facility
  deleteFacility: async (id: string) => {
    const { data } = await apiClient.delete(`/facilities/${id}`)
    return data
  },
}
