import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/store/authStore'

// Layouts
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Auth pages
import LoginPage from '@/features/auth/LoginPage'

// Dashboard pages
import SuperAdminDashboard from '@/features/dashboard/SuperAdminDashboard'
import CorporateAdminDashboard from '@/features/dashboard/CorporateAdminDashboard'
import FacilityUserDashboard from '@/features/dashboard/FacilityUserDashboard'
import AgencyUserDashboard from '@/features/dashboard/AgencyUserDashboard'

// Feature pages
import ShiftsPage from '@/features/shifts/ShiftsPage'
import StaffPage from '@/features/staff/StaffPage'
import AgenciesPage from '@/features/agencies/AgenciesPage'

// Protected Route wrapper
import ProtectedRoute from '@/routes/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Role-based dashboard routing */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardRouter />} />

          {/* Feature routes */}
          <Route path="shifts" element={<ShiftsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="agencies" element={<AgenciesPage />} />
          <Route path="facilities" element={<div>Facilities Module - Coming Soon</div>} />
          <Route path="reports" element={<div>Reports Module - Coming Soon</div>} />
          <Route path="users" element={<div>Users Module - Coming Soon</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Global toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

// Router component to select dashboard based on role
function DashboardRouter() {
  const { user } = useAuthStore()

  switch (user?.role) {
    case 'SuperAdmin':
      return <SuperAdminDashboard />
    case 'CorporateAdmin':
      return <CorporateAdminDashboard />
    case 'FacilityUser':
      return <FacilityUserDashboard />
    case 'AgencyUser':
      return <AgencyUserDashboard />
    default:
      return <Navigate to="/auth/login" replace />
  }
}

export default App
