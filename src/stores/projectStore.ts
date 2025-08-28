import { create } from 'zustand'
import { apiHelpers } from '@api/client'

export interface ProjectImage {
  url: string
  caption?: string
  isPrimary: boolean
}

export interface ProjectMetrics {
  carbonReduction?: {
    value: number
    unit: string
  }
  energySaved?: {
    value: number
    unit: string
  }
  wasteReduced?: {
    value: number
    unit: string
  }
  peopleImpacted?: number
}

export interface ProjectBudget {
  allocated: number
  spent: number
  currency: string
}

export interface Project {
  _id: string
  title: string
  description: string
  type: string
  status: 'Planning' | 'In Progress' | 'Ongoing' | 'Completed' | 'On Hold' | 'Cancelled'
  departments: string[]
  responsiblePerson: string
  responsibleEmail: string
  yearInitiated: number
  location: string
  images?: ProjectImage[]
  metrics?: ProjectMetrics
  budget?: ProjectBudget
  partners?: string[]
  tags?: string[]
  isPublic: boolean
  isFeatured: boolean
  createdBy: {
    _id: string
    fullname: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProjectStats {
  overview: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalCarbonReduction: number
    totalEnergySaved: number
    totalWasteReduced: number
    totalPeopleImpacted: number
  }
  projectTypes: Array<{
    _id: string
    count: number
  }>
}

export interface ProjectFilters {
  page?: number
  limit?: number
  type?: string
  status?: string
  search?: string
  sortBy?: 'createdAt' | 'title' | 'yearInitiated' | 'status'
  sortOrder?: 'asc' | 'desc'
}

interface ProjectState {
  projects: Project[]
  featuredProjects: Project[]
  currentProject: Project | null
  stats: ProjectStats | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProjects: (filters?: ProjectFilters) => Promise<void>
  fetchFeaturedProjects: () => Promise<void>
  fetchProjectById: (id: string) => Promise<void>
  fetchProjectStats: () => Promise<void>
  createProject: (projectData: Partial<Project>) => Promise<Project>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  clearError: () => void
  setCurrentProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  featuredProjects: [],
  currentProject: null,
  stats: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchProjects: async (filters?: ProjectFilters) => {
    try {
      set({ isLoading: true, error: null })
      
      const params = {
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...filters
      }
      
      const response = await apiHelpers.get('/projects', params)
      
      set({
        projects: response.data,
        pagination: response.pagination,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch projects',
        isLoading: false
      })
      throw error
    }
  },

  fetchFeaturedProjects: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.get('/projects/featured')
      
      set({
        featuredProjects: response.data,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch featured projects',
        isLoading: false
      })
      throw error
    }
  },

  fetchProjectById: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.get(`/projects/${id}`)
      
      set({
        currentProject: response.data,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch project',
        isLoading: false
      })
      throw error
    }
  },

  fetchProjectStats: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.get('/projects/stats')
      
      set({
        stats: response.data,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch project statistics',
        isLoading: false
      })
      throw error
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.post('/projects', projectData)
      
      // Add the new project to the list
      const currentProjects = get().projects
      set({
        projects: [response.data, ...currentProjects],
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create project',
        isLoading: false
      })
      throw error
    }
  },

  updateProject: async (id: string, projectData: Partial<Project>) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.put(`/projects/${id}`, projectData)
      
      // Update the project in the list
      const currentProjects = get().projects
      const updatedProjects = currentProjects.map(project =>
        project._id === id ? response.data : project
      )
      
      set({
        projects: updatedProjects,
        currentProject: get().currentProject?._id === id ? response.data : get().currentProject,
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update project',
        isLoading: false
      })
      throw error
    }
  },

  deleteProject: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      
      await apiHelpers.delete(`/projects/${id}`)
      
      // Remove the project from the list
      const currentProjects = get().projects
      const filteredProjects = currentProjects.filter(project => project._id !== id)
      
      set({
        projects: filteredProjects,
        currentProject: get().currentProject?._id === id ? null : get().currentProject,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete project',
        isLoading: false
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project })
  }
}))
