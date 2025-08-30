import axios, { AxiosError, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Allow browser caching for GET requests to reduce server load
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError<any>) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Only redirect to login for auth-required endpoints, but not for auth status checks
      // Don't redirect for public endpoints or auth status checks
      const url = error.config?.url || ''
      const isAuthStatusCheck = url.includes('/auth/status')
      const isPublicEndpoint = url.includes('/projects') || 
                               url.includes('/blog') || 
                               url.includes('/stats') ||
                               url.includes('/featured')
      
      if (!isPublicEndpoint && !isAuthStatusCheck && window.location.pathname !== '/login') {
        toast.error('Please log in to continue')
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      toast.error('Access denied. Insufficient permissions.')
    } else if (error.response?.status === 404) {
      // Not found
      toast.error('Resource not found')
    } else if (error.response?.status === 429) {
      // Rate limit exceeded
      toast.error('Too many requests. Please wait a moment and try again.')
    } else if (error.response && error.response.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      // Network or timeout error
      toast.error('Network error. Please check your connection.')
    } else if (!error.response) {
      // Request was made but no response received
      toast.error('No response from server. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default api

// Helper functions for different types of requests
export const apiHelpers = {
  // GET request with error handling
  get: async <T = any>(url: string, params?: any): Promise<T> => {
    try {
      const response = await api.get(url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // POST request with error handling
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // PUT request with error handling
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await api.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // DELETE request with error handling
  delete: async <T = any>(url: string): Promise<T> => {
    try {
      const response = await api.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // File upload with progress
  upload: async (
    url: string, 
    formData: FormData, 
    onProgress?: (progressEvent: any) => void
  ) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
