import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { corporatesApi, type CreateCorporateRequest } from '@/api/corporates'
import { Building2, Plus, Edit, Trash2, Users, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function CorporateManagement() {
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState<CreateCorporateRequest>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
  })

  const { data: corporates, isLoading } = useQuery({
    queryKey: ['corporates'],
    queryFn: () => corporatesApi.getAllCorporates(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCorporateRequest) => corporatesApi.createCorporate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporates'] })
      setShowCreateDialog(false)
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
      })
      toast.success('Corporate created successfully')
    },
    onError: () => {
      toast.error('Failed to create corporate')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => corporatesApi.deleteCorporate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporates'] })
      toast.success('Corporate deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete corporate')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.address) {
      toast.error('Please fill in required fields')
      return
    }
    createMutation.mutate(formData)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Corporate Management</h2>
          <p className="text-gray-600 mt-1">Manage corporate entities and their facilities</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Corporate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Corporates</p>
              <p className="text-2xl font-bold">{corporates?.length || 0}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facilities</p>
              <p className="text-2xl font-bold">
                {corporates?.reduce((sum, c) => sum + c.facilityCount, 0) || 0}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">
                {corporates?.reduce((sum, c) => sum + c.userCount, 0) || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Corporates List */}
      {isLoading ? (
        <div className="p-8 text-center">Loading corporates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corporates?.map((corporate) => (
            <div key={corporate.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{corporate.name}</h3>
                    <span
                      className={`text-xs ${
                        corporate.isActive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {corporate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {corporate.address}
                  {corporate.city && `, ${corporate.city}`}
                  {corporate.state && `, ${corporate.state}`}
                </p>
                {corporate.phoneNumber && <p>Phone: {corporate.phoneNumber}</p>}
                {corporate.email && <p>Email: {corporate.email}</p>}
              </div>

              <div className="flex gap-4 border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{corporate.facilityCount}</p>
                  <p className="text-xs text-gray-500">Facilities</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{corporate.userCount}</p>
                  <p className="text-xs text-gray-500">Users</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => toast.info('Edit functionality coming soon')}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(corporate.id, corporate.name)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {corporates?.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p>No corporates found</p>
          <p className="text-sm mt-1">Create your first corporate to get started</p>
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-semibold">Create New Corporate</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Corporate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
