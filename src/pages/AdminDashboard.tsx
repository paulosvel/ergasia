import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useAdminStore } from '@stores/adminStore'
import { useThemeStore } from '@stores/themeStore'
import toast from 'react-hot-toast'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  MoreVertical,
  Trash2,
  Shield,
  User,
  Calendar,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  const { isDark } = useThemeStore()
  const { 
    users, 
    stats, 
    isLoading, 
    pagination,
    fetchUsers, 
    fetchStats, 
    approveUser, 
    rejectUser, 
    updateUserRole, 
    deleteUser 
  } = useAdminStore()

  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats()
      fetchUsers({ page: currentPage, status: statusFilter, search: searchTerm })
    }
  }, [user, currentPage, statusFilter, searchTerm])

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId)
      toast.success('User approved successfully')
      fetchStats() // Refresh stats
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId)
      toast.success('User approval revoked')
      fetchStats() // Refresh stats
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole)
      toast.success(`User role updated to ${newRole}`)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId)
        toast.success('User deleted successfully')
        fetchStats() // Refresh stats
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
          <div className={`card ${isDark ? 'card-dark' : ''} p-8 text-center`}>
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Access Denied
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              You need admin privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`heading-2 mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin/blog"
              className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <FileText className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Blog Management
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create and manage blog posts
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/comments"
              className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <MessageSquare className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Comment Management
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Review and approve comments
                  </p>
                </div>
              </div>
            </Link>

            <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <Users className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    User Management
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage user accounts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Users
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>

              <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pending Approval
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {stats.pendingUsers}
                    </p>
                  </div>
                  <UserX className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
              </div>

              <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Approved Users
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {stats.approvedUsers}
                    </p>
                  </div>
                  <UserCheck className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>

              <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Admins
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {stats.adminUsers}
                    </p>
                  </div>
                  <Shield className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
              </div>

              <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      New This Week
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {stats.recentRegistrations}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-lg ${isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                >
                  <option value="">All Users</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User Management
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        User
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Role
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Status
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Joined
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-4 px-4">
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {userItem.fullname}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {userItem.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={userItem.role}
                            onChange={(e) => handleRoleChange(userItem._id, e.target.value as 'user' | 'admin')}
                            disabled={userItem._id === user?._id}
                            className={`px-2 py-1 text-sm border rounded ${isDark 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                            } ${userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userItem.approved
                              ? isDark
                                ? 'bg-green-900 text-green-300'
                                : 'bg-green-100 text-green-800'
                              : isDark
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {userItem.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDate(userItem.createdAt)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {!userItem.approved ? (
                              <button
                                onClick={() => handleApprove(userItem._id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReject(userItem._id)}
                                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                              >
                                Revoke
                              </button>
                            )}
                            
                            {userItem._id !== user?._id && (
                              <button
                                onClick={() => handleDelete(userItem._id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.total}
                    className={`px-3 py-1 rounded ${isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
