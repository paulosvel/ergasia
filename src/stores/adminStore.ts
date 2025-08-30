import { create } from 'zustand'
import api from '@api/client'

export interface AdminUser {
  _id: string
  fullname: string
  email: string
  role: 'user' | 'admin'
  approved: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  pendingUsers: number
  approvedUsers: number
  adminUsers: number
  recentRegistrations: number
}

interface AdminState {
  users: AdminUser[]
  stats: AdminStats | null
  isLoading: boolean
  pagination: {
    current: number
    total: number
    totalUsers: number
  } | null
  
  // Actions
  fetchUsers: (params?: { page?: number; limit?: number; status?: string; search?: string }) => Promise<void>
  fetchStats: () => Promise<void>
  approveUser: (userId: string) => Promise<void>
  rejectUser: (userId: string) => Promise<void>
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>
  clearUsers: () => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  stats: null,
  isLoading: false,
  pagination: null,

  fetchUsers: async (params = {}) => {
    try {
      set({ isLoading: true })
      
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.status) queryParams.append('status', params.status)
      if (params.search) queryParams.append('search', params.search)
      
      const response = await api.get(`/admin/users?${queryParams.toString()}`)
      const { users, pagination } = response.data
      
      set({
        users,
        pagination,
        isLoading: false
      })
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to fetch users')
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoading: true })
      
      const response = await api.get('/admin/stats')
      const { stats } = response.data
      
      set({
        stats,
        isLoading: false
      })
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to fetch stats')
    }
  },

  approveUser: async (userId: string) => {
    try {
      set({ isLoading: true })
      
      const response = await api.put(`/admin/users/${userId}/approve`)
      const { user } = response.data
      
      // Update the user in the list
      const { users } = get()
      const updatedUsers = users.map(u => u._id === userId ? user : u)
      
      set({
        users: updatedUsers,
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to approve user')
    }
  },

  rejectUser: async (userId: string) => {
    try {
      set({ isLoading: true })
      
      const response = await api.put(`/admin/users/${userId}/reject`)
      const { user } = response.data
      
      // Update the user in the list
      const { users } = get()
      const updatedUsers = users.map(u => u._id === userId ? user : u)
      
      set({
        users: updatedUsers,
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to reject user')
    }
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    try {
      set({ isLoading: true })
      
      const response = await api.put(`/admin/users/${userId}/role`, { role })
      const { user } = response.data
      
      // Update the user in the list
      const { users } = get()
      const updatedUsers = users.map(u => u._id === userId ? user : u)
      
      set({
        users: updatedUsers,
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to update user role')
    }
  },

  deleteUser: async (userId: string) => {
    try {
      set({ isLoading: true })
      
      await api.delete(`/admin/users/${userId}`)
      
      // Remove the user from the list
      const { users } = get()
      const updatedUsers = users.filter(u => u._id !== userId)
      
      set({
        users: updatedUsers,
        isLoading: false
      })
      
      return { success: true, message: 'User deleted successfully' }
    } catch (error: any) {
      set({ isLoading: false })
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  },

  clearUsers: () => {
    set({
      users: [],
      pagination: null
    })
  }
}))
