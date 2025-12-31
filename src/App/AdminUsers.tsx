import { useEffect, useState } from 'react'
import { apiClient } from '../Api/axiosConfig'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import PageLoader from '../Components/PageLoader'

interface User {
  _id: string
  name: string
  email: string
  username: string
  isAdmin: boolean
  createdAt: string
  orders?: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const authState = useSelector((state: any) => state.authSlice)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authState?.user?.isAdmin) {
      toast.error('Access denied')
      navigate('/admin')
      return
    }
    fetchUsers()
  }, [authState, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/users')
      const usersList = Array.isArray(data) ? data : data?.users || []
      setUsers(usersList)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (id: string, isCurrentlyAdmin: boolean) => {
    const action = isCurrentlyAdmin ? 'remove admin privileges from' : 'make admin'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      await apiClient.put(`/users/${id}/admin`, { isAdmin: !isCurrentlyAdmin })
      toast.success(`User ${isCurrentlyAdmin ? 'demoted' : 'promoted'} successfully`)
      setUsers(users.map(u => u._id === id ? { ...u, isAdmin: !isCurrentlyAdmin } : u))
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    }
  }

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return

    try {
      await apiClient.delete(`/users/${id}`)
      toast.success('User deleted')
      setUsers(users.filter(u => u._id !== id))
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoader message="Loading users..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{users?.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Admins</p>
            <p className="text-3xl font-bold text-blue-600">{users.filter(u => u.isAdmin)?.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Regular Users</p>
            <p className="text-3xl font-bold text-gray-900">{users.filter(u => !u.isAdmin)?.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <input
            type="search"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users Table */}
        {filteredUsers?.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          user.isAdmin
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isAdmin ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {authState?.user?._id !== user._id && (
                            <>
                              <button
                                onClick={() => toggleAdmin(user._id, user.isAdmin)}
                                className={`p-2 rounded transition-colors ${
                                  user.isAdmin
                                    ? 'text-blue-600 hover:bg-blue-50'
                                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                                title={user.isAdmin ? 'Remove admin' : 'Make admin'}
                              >
                                👑
                              </button>
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete user"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
