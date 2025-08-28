import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@api/client'

export interface User {
  _id: string
  fullname: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  emailVerified: boolean
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: { fullname: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/login', {
            email,
            password
          })
          
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || 'Login failed')
        }
      },

      register: async (data: { fullname: string; email: string; password: string }) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/register', data)
          
          // Note: Registration might not automatically log in the user
          // depending on email verification requirements
          
          set({ isLoading: false })
          
          return response.data
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || 'Registration failed')
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error)
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true })
          
          const response = await api.get('/auth/status')
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // User is not authenticated
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
