// ============================================
// USER & AUTH TYPES
// ============================================

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  CorporateAdmin = 'CorporateAdmin',
  FacilityUser = 'FacilityUser',
  AgencyUser = 'AgencyUser',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  corporateId?: string
  facilityId?: string
  agencyId?: string
  isApproved: boolean
  approvedBy?: string
  approvalDate?: string
  createdAt: string
  lastLogin?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

// ============================================
// SHIFT TYPES
// ============================================

export enum ShiftStatus {
  Unfilled = 'Unfilled',
  Pending = 'Pending',
  Filled = 'Filled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum ShiftPriority {
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent',
}

export enum ShiftType {
  Day = 'Day',
  Night = 'Night',
  Afternoon = 'Afternoon',
}

export interface Shift {
  id: string
  facilityId: string
  facilityName: string
  departmentId: string
  departmentName: string
  role: StaffRole
  date: string
  startTime: string
  endTime: string
  duration: number
  hourlyRate: number
  isPremiumRate: boolean
  status: ShiftStatus
  priority: ShiftPriority
  type: ShiftType
  qualificationsRequired: string[]
  specialNotes?: string
  broadcastTier?: AgencyTier
  assignedStaffId?: string
  assignedStaffName?: string
  assignedAgencyId?: string
  assignedAgencyName?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ShiftCreateRequest {
  facilityId: string
  departmentId: string
  role: StaffRole
  date: string
  startTime: string
  endTime: string
  hourlyRate: number
  isPremiumRate?: boolean
  priority?: ShiftPriority
  type?: ShiftType
  qualificationsRequired?: string[]
  specialNotes?: string
}

// ============================================
// STAFF TYPES
// ============================================

export enum StaffRole {
  RN = 'RN',
  EN = 'EN',
  PCA = 'PCA',
  Physiotherapist = 'Physiotherapist',
  OccupationalTherapist = 'OccupationalTherapist',
  SocialWorker = 'SocialWorker',
  Dietitian = 'Dietitian',
  Other = 'Other',
}

export interface Staff {
  id: string
  agencyId: string
  name: string
  email: string
  contactNumber: string
  role: StaffRole
  dateOfBirth: string
  qualifications: string[]
  certifications: Certification[]
  isAvailable: boolean
  emergencyContact: string
  address: string
  profilePicture?: string
  hireDate: string
  lastAssignment?: string
  performanceRating: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Certification {
  id: string
  staffId: string
  name: string
  issueDate: string
  expiryDate: string
  issuingAuthority: string
  documentReference?: string
  isVerified: boolean
}

export interface Availability {
  id: string
  staffId: string
  date: string
  startTime: string
  endTime: string
  recurrencePattern?: string
  preferredLocation?: string
  notes?: string
}

// ============================================
// AGENCY TYPES
// ============================================

export enum AgencyTier {
  Tier1 = 'Tier1',
  Tier2 = 'Tier2',
  Tier3 = 'Tier3',
}

export interface Agency {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  specializations: StaffRole[]
  serviceLocations: string[]
  tier: AgencyTier
  fillRate: number
  averageResponseTime: number
  qualityRating: number
  cancellationRate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AgencyPerformanceMetrics {
  agencyId: string
  agencyName: string
  tier: AgencyTier
  fillRate: number
  averageResponseTime: number // minutes
  qualityRating: number
  cancellationRate: number
  totalShiftsOffered: number
  totalShiftsFilled: number
  monthlyTrend: PerformanceTrend[]
  eligibleForAdvancement: boolean
  requirementsForNextTier?: TierRequirement[]
}

export interface PerformanceTrend {
  month: string
  fillRate: number
  responseTime: number
  qualityRating: number
}

export interface TierRequirement {
  metric: string
  required: number
  current: number
  met: boolean
}

// ============================================
// FACILITY TYPES
// ============================================

export interface Facility {
  id: string
  corporateId: string
  name: string
  location: string
  contactPerson: string
  email: string
  phone: string
  operatingHoursStart: string
  operatingHoursEnd: string
  staffCount: number
  activeShifts: number
  fillRate: number
  isActive: boolean
  createdAt: string
  departments: Department[]
}

export interface Department {
  id: string
  facilityId: string
  name: string
  description?: string
  requiredStaff: number
  notes?: string
}

export interface RoleRequirement {
  id: string
  departmentId: string
  role: StaffRole
  minimumCount: number
  optimalCount: number
  baseRate: number
  qualificationsRequired: string[]
  notes?: string
}

// ============================================
// CORPORATE TYPES
// ============================================

export interface Corporate {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  contractStartDate: string
  contractEndDate: string
  isActive: boolean
  createdAt: string
}

// ============================================
// ASSIGNMENT TYPES
// ============================================

export enum AssignmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface Assignment {
  id: string
  staffId: string
  staffName: string
  shiftId: string
  agencyId: string
  agencyName: string
  assignmentDate: string
  completionDate?: string
  rating?: number
  feedback?: string
  status: AssignmentStatus
  issueReport?: string
  checkInTime?: string
  checkOutTime?: string
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export enum NotificationPriority {
  High = 'High',
  Medium = 'Medium',
  Standard = 'Standard',
}

export enum NotificationType {
  ShiftBroadcast = 'ShiftBroadcast',
  DirectRequest = 'DirectRequest',
  AssignmentConfirmation = 'AssignmentConfirmation',
  ShiftCancellation = 'ShiftCancellation',
  UserApproval = 'UserApproval',
  PerformanceAlert = 'PerformanceAlert',
  SystemAlert = 'SystemAlert',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}

// ============================================
// BROADCAST & REQUEST TYPES
// ============================================

export interface ShiftBroadcastRequest {
  shiftId: string
  broadcastType: 'TierBased' | 'DirectRequest'
  targetTier?: AgencyTier
  targetAgencyId?: string
  priority: ShiftPriority
  responseSLA: number // minutes
  specialNotes?: string
}

export interface AgencyResponse {
  id: string
  shiftId: string
  agencyId: string
  agencyName: string
  responseTime: number // minutes
  proposedStaff: StaffProposal[]
  status: 'Pending' | 'Accepted' | 'Declined'
  declineReason?: string
  createdAt: string
}

export interface StaffProposal {
  staffId: string
  staffName: string
  role: StaffRole
  qualifications: string[]
  certifications: string[]
  performanceRating: number
  hourlyRate: number
  availability: string
}

// ============================================
// ANALYTICS & REPORTING TYPES
// ============================================

export interface DashboardMetrics {
  totalShifts: number
  filledShifts: number
  unfilledShifts: number
  fillRate: number
  averageCostPerShift: number
  totalStaff: number
  activeAssignments: number
  pendingApprovals: number
}

export interface ShiftAnalytics {
  fillRateByDepartment: { department: string; fillRate: number }[]
  fillRateByRole: { role: StaffRole; fillRate: number }[]
  costTrends: { month: string; cost: number }[]
  shiftsByDayOfWeek: { day: string; count: number }[]
  urgencyDistribution: { priority: ShiftPriority; count: number }[]
}

export interface AgencyAnalytics {
  topPerformingAgencies: {
    agencyId: string
    agencyName: string
    fillRate: number
    averageRating: number
  }[]
  tierDistribution: { tier: AgencyTier; count: number }[]
  responseTimeComparison: {
    agencyId: string
    agencyName: string
    averageResponseTime: number
  }[]
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ErrorResponse {
  message: string
  errors?: { [key: string]: string[] }
  statusCode: number
}
