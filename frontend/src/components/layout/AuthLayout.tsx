import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore()

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            StaffGrid
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Healthcare Staffing Management
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <Outlet />
        </div>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 StaffGrid. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
