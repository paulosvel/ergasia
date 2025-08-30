import { create } from 'zustand'
import { apiHelpers } from '@api/client'

export interface BlogComment {
  _id: string
  author: {
    _id: string
    fullname: string
    avatar?: string
  }
  content: string
  isApproved: boolean
  createdAt: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  author: {
    _id: string
    fullname: string
    email: string
    avatar?: string
  }
  categories: string[]
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  isPublic: boolean
  isFeatured: boolean
  views: number
  likes: string[]
  comments: BlogComment[]
  relatedPosts?: BlogPost[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogFilters {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
  author?: string
  featured?: boolean
}

interface BlogState {
  posts: BlogPost[]
  featuredPosts: BlogPost[]
  currentPost: BlogPost | null
  categories: Array<{ _id: string; count: number }>
  tags: Array<{ _id: string; count: number }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchPosts: (filters?: BlogFilters) => Promise<void>
  fetchFeaturedPosts: () => Promise<void>
  fetchPostBySlug: (slug: string) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchTags: () => Promise<void>
  createPost: (postData: Partial<BlogPost>) => Promise<BlogPost>
  updatePost: (id: string, postData: Partial<BlogPost>) => Promise<BlogPost>
  deletePost: (id: string) => Promise<void>
  toggleLike: (id: string) => Promise<void>
  addComment: (id: string, content: string) => Promise<BlogComment>
  approveComment: (commentId: string) => Promise<void>
  rejectComment: (commentId: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  clearError: () => void
  setCurrentPost: (post: BlogPost | null) => void
}

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  featuredPosts: [],
  currentPost: null,
  categories: [],
  tags: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchPosts: async (filters?: BlogFilters) => {
    try {
      set({ isLoading: true, error: null })
      
      const params = {
        page: 1,
        limit: 10,
        ...filters
      }
      
      const response = await apiHelpers.get('/blog', params)
      
      set({
        posts: response.data,
        pagination: response.pagination,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch blog posts',
        isLoading: false
      })
      throw error
    }
  },

  fetchFeaturedPosts: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.get('/blog/featured')
      
      set({
        featuredPosts: response.data,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch featured posts',
        isLoading: false
      })
      throw error
    }
  },

  fetchPostBySlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.get(`/blog/${slug}`)
      
      set({
        currentPost: response.data,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch blog post',
        isLoading: false
      })
      throw error
    }
  },

  fetchCategories: async () => {
    try {
      const response = await apiHelpers.get('/blog/categories')
      set({ categories: response.data })
    } catch (error: any) {
      console.error('Failed to fetch categories:', error)
    }
  },

  fetchTags: async () => {
    try {
      const response = await apiHelpers.get('/blog/tags')
      set({ tags: response.data })
    } catch (error: any) {
      console.error('Failed to fetch tags:', error)
    }
  },

  createPost: async (postData: Partial<BlogPost>) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.post('/blog', postData)
      
      // Add the new post to the list
      const currentPosts = get().posts
      set({
        posts: [response.data, ...currentPosts],
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({
        error: error.response?.data?.errors?.map((err: any) => err.msg).join(', ') || error.message || 'Failed to create blog post',
        isLoading: false
      })
      throw error
    }
  },

  updatePost: async (id: string, postData: Partial<BlogPost>) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await apiHelpers.put(`/blog/${id}`, postData)
      
      // Update the post in the list
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post =>
        post._id === id ? response.data : post
      )
      
      set({
        posts: updatedPosts,
        currentPost: get().currentPost?._id === id ? response.data : get().currentPost,
        isLoading: false
      })
      
      return response.data
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update blog post',
        isLoading: false
      })
      throw error
    }
  },

  deletePost: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      
      await apiHelpers.delete(`/blog/${id}`)
      
      // Remove the post from the list
      const currentPosts = get().posts
      const filteredPosts = currentPosts.filter(post => post._id !== id)
      
      set({
        posts: filteredPosts,
        currentPost: get().currentPost?._id === id ? null : get().currentPost,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete blog post',
        isLoading: false
      })
      throw error
    }
  },

  toggleLike: async (id: string) => {
    try {
      const response = await apiHelpers.post(`/blog/${id}/like`)
      
      // Update the post likes in the store
      const currentPost = get().currentPost
      if (currentPost && currentPost._id === id) {
        set({
          currentPost: {
            ...currentPost,
            likes: response.data.isLiked 
              ? [...currentPost.likes, 'current-user'] 
              : currentPost.likes.filter(like => like !== 'current-user')
          }
        })
      }
      
      // Also update in the posts list
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post => {
        if (post._id === id) {
          return {
            ...post,
            likes: response.data.isLiked 
              ? [...post.likes, 'current-user'] 
              : post.likes.filter(like => like !== 'current-user')
          }
        }
        return post
      })
      
      set({ posts: updatedPosts })
      
    } catch (error: any) {
      console.error('Failed to toggle like:', error)
      throw error
    }
  },

  addComment: async (id: string, content: string) => {
    try {
      const response = await apiHelpers.post(`/blog/${id}/comments`, { content })
      
      // Update the current post with the new comment
      const currentPost = get().currentPost
      if (currentPost && currentPost._id === id) {
        set({
          currentPost: {
            ...currentPost,
            comments: [...currentPost.comments, response.data]
          }
        })
      }
      
      // Also update in the posts list
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post => {
        if (post._id === id) {
          return {
            ...post,
            comments: [...post.comments, response.data]
          }
        }
        return post
      })
      
      set({ posts: updatedPosts })
      
      return response.data
    } catch (error: any) {
      console.error('Failed to add comment:', error)
      throw error
    }
  },

  approveComment: async (commentId: string) => {
    try {
      await apiHelpers.put(`/blog/comments/${commentId}/approve`)
      
      // Update comment approval status in all posts
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: true }
            : comment
        )
      }))
      
      set({ posts: updatedPosts })
      
      // Also update current post if it contains this comment
      const currentPost = get().currentPost
      if (currentPost) {
        const updatedComments = currentPost.comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: true }
            : comment
        )
        set({
          currentPost: {
            ...currentPost,
            comments: updatedComments
          }
        })
      }
    } catch (error: any) {
      console.error('Failed to approve comment:', error)
      throw error
    }
  },

  rejectComment: async (commentId: string) => {
    try {
      await apiHelpers.put(`/blog/comments/${commentId}/reject`)
      
      // Update comment approval status in all posts
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: false }
            : comment
        )
      }))
      
      set({ posts: updatedPosts })
      
      // Also update current post if it contains this comment
      const currentPost = get().currentPost
      if (currentPost) {
        const updatedComments = currentPost.comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: false }
            : comment
        )
        set({
          currentPost: {
            ...currentPost,
            comments: updatedComments
          }
        })
      }
    } catch (error: any) {
      console.error('Failed to reject comment:', error)
      throw error
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      await apiHelpers.delete(`/blog/comments/${commentId}`)
      
      // Remove comment from all posts
      const currentPosts = get().posts
      const updatedPosts = currentPosts.map(post => ({
        ...post,
        comments: post.comments.filter(comment => comment._id !== commentId)
      }))
      
      set({ posts: updatedPosts })
      
      // Also remove from current post if it contains this comment
      const currentPost = get().currentPost
      if (currentPost) {
        const updatedComments = currentPost.comments.filter(comment => comment._id !== commentId)
        set({
          currentPost: {
            ...currentPost,
            comments: updatedComments
          }
        })
      }
    } catch (error: any) {
      console.error('Failed to delete comment:', error)
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },

  setCurrentPost: (post: BlogPost | null) => {
    set({ currentPost: post })
  }
}))
