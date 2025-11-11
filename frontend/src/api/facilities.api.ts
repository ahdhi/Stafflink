import { apiClient } from './client'
import type {
  Facility,
  Department,
  RoleRequirement,
  PaginatedResponse,
  DashboardMetrics,
} from '@/types'

export const facilitiesApi = {
  // Get all facilities
  getFacilities: async (params?: {
    page?: number
    pageSize?: number
    corporateId?: string
    isActive?: boolean
  }): Promise<PaginatedResponse<Facility>> => {
    const response = await apiClient.get<PaginatedResponse<Facility>>(
      '/facilities',
      { params }
    )
    return response.data
  },

  // Get facility by ID
  getFacilityById: async (id: string): Promise<Facility> => {
    const response = await apiClient.get<Facility>(`/facilities/${id}`)
    return response.data
  },

  // Create facility
  createFacility: async (data: Partial<Facility>): Promise<Facility> => {
    const response = await apiClient.post<Facility>('/facilities', data)
    return response.data
  },

  // Update facility
  updateFacility: async (
    id: string,
    data: Partial<Facility>
  ): Promise<Facility> => {
    const response = await apiClient.put<Facility>(`/facilities/${id}`, data)
    return response.data
  },

  // Delete facility
  deleteFacility: async (id: string): Promise<void> => {
    await apiClient.delete(`/facilities/${id}`)
  },

  // Get facility metrics
  getFacilityMetrics: async (id: string): Promise<DashboardMetrics> => {
    const response = await apiClient.get<DashboardMetrics>(
      `/facilities/${id}/metrics`
    )
    return response.data
  },

  // Get facility departments
  getFacilityDepartments: async (facilityId: string): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>(
      `/facilities/${facilityId}/departments`
    )
    return response.data
  },

  // Create department
  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const response = await apiClient.post<Department>('/departments', data)
    return response.data
  },

  // Update department
  updateDepartment: async (
    id: string,
    data: Partial<Department>
  ): Promise<Department> => {
    const response = await apiClient.put<Department>(`/departments/${id}`, data)
    return response.data
  },

  // Delete department
  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`)
  },

  // Get department role requirements
  getDepartmentRoleRequirements: async (
    departmentId: string
  ): Promise<RoleRequirement[]> => {
    const response = await apiClient.get<RoleRequirement[]>(
      `/departments/${departmentId}/role-requirements`
    )
    return response.data
  },

  // Add role requirement
  addRoleRequirement: async (
    data: Partial<RoleRequirement>
  ): Promise<RoleRequirement> => {
    const response = await apiClient.post<RoleRequirement>(
      '/role-requirements',
      data
    )
    return response.data
  },
}
