import { apiClient } from './client'

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  CorporateAdmin = 'CorporateAdmin',
  FacilityUser = 'FacilityUser',
  AgencyUser = 'AgencyUser',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface UserCreationRequestDto {
  id: string
  name: string
  email: string
  phoneNumber?: string
  role: UserRole
  approvalStatus: ApprovalStatus
  requestedBy: string
  requestedByName?: string
  approvedBy?: string
  approvedByName?: string
  corporateId?: string
  corporateName?: string
  facilityId?: string
  facilityName?: string
  agencyId?: string
  agencyName?: string
  approvedAt?: string
  rejectionReason?: string
  notes?: string
  createdUserId?: string
  createdAt: string
}

export interface CreateUserCreationRequest {
  name: string
  email: string
  phoneNumber?: string
  role: UserRole
  corporateId?: string
  facilityId?: string
  agencyId?: string
  notes?: string
}

export interface ApproveUserCreationRequestDto {
  notes?: string
}

export interface RejectUserCreationRequestDto {
  reason: string
}

export const userCreationRequestsApi = {
  // Get all requests
  getAllRequests: async () => {
    const { data } = await apiClient.get<UserCreationRequestDto[]>('/usercreationrequests')
    return data
  },

  // Get pending requests (Super Admin only)
  getPendingRequests: async () => {
    const { data } = await apiClient.get<UserCreationRequestDto[]>('/usercreationrequests/pending')
    return data
  },

  // Get request by ID
  getRequestById: async (id: string) => {
    const { data } = await apiClient.get<UserCreationRequestDto>(`/usercreationrequests/${id}`)
    return data
  },

  // Create request (Corporate Admin)
  createRequest: async (request: CreateUserCreationRequest) => {
    const { data } = await apiClient.post<UserCreationRequestDto>('/usercreationrequests', request)
    return data
  },

  // Approve request (Super Admin only)
  approveRequest: async (id: string, approveDto: ApproveUserCreationRequestDto) => {
    const { data } = await apiClient.post(`/usercreationrequests/${id}/approve`, approveDto)
    return data
  },

  // Reject request (Super Admin only)
  rejectRequest: async (id: string, rejectDto: RejectUserCreationRequestDto) => {
    const { data } = await apiClient.post(`/usercreationrequests/${id}/reject`, rejectDto)
    return data
  },
}
