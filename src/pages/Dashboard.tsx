import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import { useBlogStore } from '@stores/blogStore'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  Settings, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  User,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  categories: string[]
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  isPublic: boolean
  isFeatured: boolean
  featuredImage?: string
}

const Dashboard = () => {
  const { user } = useAuthStore()
  const { isDark } = useThemeStore()
  const { 
    posts, 
    isLoading, 
    error, 
    fetchPosts, 
    createPost, 
    updatePost, 
    deletePost,
    clearError 
  } = useBlogStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'blog' | 'comments'>('overview')
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    categories: [],
    tags: [],
    status: 'draft',
    isPublic: true,
    isFeatured: false,
    featuredImage: ''
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPosts()
    }
  }, [user])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPost) {
        await updatePost(editingPost._id, formData)
        toast.success('Blog post updated successfully!')
      } else {
        await createPost(formData)
        toast.success('Blog post created successfully!')
      }
      
      resetBlogForm()
      setShowBlogForm(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post')
    }
  }

  const handleEditBlog = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      categories: post.categories,
      tags: post.tags,
      status: post.status,
      isPublic: post.isPublic,
      isFeatured: post.isFeatured,
      featuredImage: post.featuredImage || ''
    })
    setShowBlogForm(true)
  }

  const handleDeleteBlog = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deletePost(postId)
        toast.success('Blog post deleted successfully!')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete blog post')
      }
    }
  }

  const resetBlogForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      categories: [],
      tags: [],
      status: 'draft',
      isPublic: true,
      isFeatured: false,
      featuredImage: ''
    })
    setEditingPost(null)
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const pendingComments = posts.reduce((total, post) => 
    total + post.comments?.filter(comment => !comment.isApproved).length, 0
  )

  const totalComments = posts.reduce((total, post) => 
    total + post.comments?.length, 0
  )

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`heading-2 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.fullname}!
          </h1>
          
          {user?.role === 'admin' ? (
            <>
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'blog'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Blog Management
                </button>
                {/* <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'comments'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Comments ({pendingComments})
                </button> */}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Link to="/admin" className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 group`}>
                    <div className="flex items-center justify-between mb-4">
                      <Shield className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      User Management
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Manage user approvals, roles, and system settings
                    </p>
                  </Link>

                  <div 
                    onClick={() => setActiveTab('blog')}
                    className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FileText className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Blog Management
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Create and manage blog posts ({posts.length} posts)
                    </p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('comments')}
                    className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <MessageSquare className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Comments
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Review and approve comments ({pendingComments} pending)
                    </p>
                  </div>

                  <Link to="/add-project" className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200 group`}>
                    <div className="flex items-center justify-between mb-4">
                      <Settings className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Add Project
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Create new sustainability projects
                    </p>
                  </Link>
                </div>
              )}

              {/* Blog Management Tab */}
              {activeTab === 'blog' && (
                <div>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Blog Management
                      </h2>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Create, edit, and manage blog posts
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        resetBlogForm()
                        setShowBlogForm(true)
                      }}
                      className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
                    >
                      <Plus className="w-4 h-4" />
                      New Blog Post
                    </button>
                  </div>

                  {/* Filters and Search */}
                  <div className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDark 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          />
                        </div>
                      </div>
                      
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-2 border rounded-lg ${isDark 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      >
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Blog Posts List */}
                  <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                    <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Blog Posts ({filteredPosts.length})
                    </h3>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading posts...</p>
                      </div>
                    ) : filteredPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No blog posts found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredPosts.map((post) => (
                          <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 border rounded-lg ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {post.title}
                                  </h4>
                                  {post.isFeatured && (
                                    <Star className="w-4 h-4 text-yellow-500" />
                                  )}
                                  {post.isPublic ? (
                                    <Eye className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                  )}
                                </div>
                                
                                <p className={`text-sm mb-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {post.excerpt || post.content.substring(0, 150)}...
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                      {post.author.fullname}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                      {formatDate(post.createdAt)}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    post.status === 'published' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : post.status === 'draft'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {post.status}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleEditBlog(post)}
                                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(post._id)}
                                  className={`p-2 rounded-lg text-red-500 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div>
                  <div className="mb-8">
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Comment Management
                    </h2>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Review and manage blog comments
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Comments
                          </p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {totalComments}
                          </p>
                        </div>
                        <MessageSquare className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                    </div>

                    <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Pending Approval
                          </p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {pendingComments}
                          </p>
                        </div>
                        <MessageSquare className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      </div>
                    </div>
                  </div>

                  <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                    <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      For detailed comment management, please visit the{' '}
                      <Link to="/admin/comments" className="text-primary-600 hover:text-primary-700">
                        Comment Management page
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Blog Form Modal */}
              {showBlogForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  onClick={() => setShowBlogForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isDark ? 'card-dark' : 'card'} p-6`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {editingPost ? 'Edit Post' : 'Create New Post'}
                      </h2>
                      <button
                        onClick={() => setShowBlogForm(false)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          className={`w-full px-4 py-2 border rounded-lg ${isDark 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                        />
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Excerpt
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          rows={3}
                          className={`w-full px-4 py-2 border rounded-lg ${isDark 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none`}
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Content *
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          required
                          rows={10}
                          className={`w-full px-4 py-2 border rounded-lg ${isDark 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none`}
                        />
                      </div>

                      {/* Featured Image */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Featured Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.featuredImage}
                          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${isDark 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                        />
                      </div>

                      {/* Categories and Tags */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Categories (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.categories.join(', ')}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              categories: e.target.value.split(',').map(cat => cat.trim()).filter(cat => cat)
                            })}
                            className={`w-full px-4 py-2 border rounded-lg ${isDark 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.tags.join(', ')}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                            })}
                            className={`w-full px-4 py-2 border rounded-lg ${isDark 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          />
                        </div>
                      </div>

                      {/* Status and Options */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className={`w-full px-4 py-2 border rounded-lg ${isDark 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="rounded"
                          />
                          <label htmlFor="isPublic" className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Public
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="rounded"
                          />
                          <label htmlFor="isFeatured" className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Featured
                          </label>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => setShowBlogForm(false)}
                          className={`px-4 py-2 border rounded-lg ${isDark 
                            ? 'border-gray-600 text-white hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          {editingPost ? 'Update Post' : 'Create Post'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </>
          ) : (
            <div className={`card ${isDark ? 'card-dark' : ''} p-8`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                User Dashboard
              </h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome to your sustainability dashboard. Here you can track your contributions, 
                view project updates, and access personalized content.
              </p>
              
              {!user?.approved && (
                <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className={`${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    ⚠️ Your account is pending admin approval. You'll be able to access all features once approved.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
