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

          {/* Feature routes will be added here */}
          <Route path="shifts/*" element={<div>Shifts Module</div>} />
          <Route path="staff/*" element={<div>Staff Module</div>} />
          <Route path="agencies/*" element={<div>Agencies Module</div>} />
          <Route path="facilities/*" element={<div>Facilities Module</div>} />
          <Route path="reports/*" element={<div>Reports Module</div>} />
          <Route path="users/*" element={<div>Users Module</div>} />
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
