import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function PendingApprovals() {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => usersApi.getPendingApprovals(),
  })

  const approveMutation = useMutation({
    mutationFn: (userId: string) => usersApi.approveUser(userId, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] })
      toast.success('User approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve user')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      usersApi.rejectUser(userId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] })
      setShowRejectDialog(false)
      setRejectReason('')
      setSelectedUserId(null)
      toast.success('User rejected')
    },
    onError: () => {
      toast.error('Failed to reject user')
    },
  })

  const handleApprove = (userId: string) => {
    if (confirm('Are you sure you want to approve this user?')) {
      approveMutation.mutate(userId)
    }
  }

  const handleRejectClick = (userId: string) => {
    setSelectedUserId(userId)
    setShowRejectDialog(true)
  }

  const handleRejectSubmit = () => {
    if (!selectedUserId || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    rejectMutation.mutate({ userId: selectedUserId, reason: rejectReason })
  }

  if (isLoading) {
    return <div className="p-4">Loading pending approvals...</div>
  }

  if (!pendingUsers || pendingUsers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <AlertCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
        <p>No pending approvals</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pending User Approvals</h2>

      <div className="space-y-2">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{user.name}</h3>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>
              {user.corporateName && (
                <p className="text-xs text-gray-500">Corporate: {user.corporateName}</p>
              )}
              {user.facilityName && (
                <p className="text-xs text-gray-500">Facility: {user.facilityName}</p>
              )}
              {user.agencyName && (
                <p className="text-xs text-gray-500">Agency: {user.agencyName}</p>
              )}
              <p className="text-xs text-gray-400">
                Requested: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(user.id)}
                disabled={approveMutation.isPending}
                className="flex items-center gap-1 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => handleRejectClick(user.id)}
                disabled={rejectMutation.isPending}
                className="flex items-center gap-1 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Reject User</h3>
            <p className="mb-4 text-sm text-gray-600">
              Please provide a reason for rejecting this user:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mb-4 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectReason('')
                  setSelectedUserId(null)
                }}
                className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={rejectMutation.isPending}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                Reject User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
