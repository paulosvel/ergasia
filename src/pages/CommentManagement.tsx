import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useBlogStore, BlogComment } from '@stores/blogStore'
import { useThemeStore } from '@stores/themeStore'
import toast from 'react-hot-toast'
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  Trash2, 
  User,
  Calendar,
  MessageSquare,
  Eye,
  EyeOff,
  AlertTriangle,
  Shield
} from 'lucide-react'

interface CommentWithPost extends BlogComment {
  postTitle: string
  postSlug: string
}

const CommentManagement = () => {
  const { user } = useAuthStore()
  const { isDark } = useThemeStore()
  const { 
    posts, 
    isLoading, 
    error, 
    fetchPosts,
    approveComment,
    rejectComment,
    deleteComment,
    clearError 
  } = useBlogStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPost, setSelectedPost] = useState('')

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

  // Flatten all comments from all posts
  const allComments: CommentWithPost[] = posts.flatMap(post => 
    post.comments.map(comment => ({
      ...comment,
      postTitle: post.title,
      postSlug: post.slug
    }))
  )

  const handleApproveComment = async (commentId: string) => {
    try {
      await approveComment(commentId)
      toast.success('Comment approved successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve comment')
    }
  }

  const handleRejectComment = async (commentId: string) => {
    try {
      await rejectComment(commentId)
      toast.success('Comment rejected successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        await deleteComment(commentId)
        toast.success('Comment deleted successfully!')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete comment')
      }
    }
  }

  const filteredComments = allComments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'approved' && comment.isApproved) ||
                         (statusFilter === 'pending' && !comment.isApproved)
    const matchesPost = !selectedPost || comment.postSlug === selectedPost
    return matchesSearch && matchesStatus && matchesPost
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingComments = allComments.filter(comment => !comment.isApproved).length
  const approvedComments = allComments.filter(comment => comment.isApproved).length

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
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link 
                    to="/admin" 
                    className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/</span>
                </li>
                <li>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Comment Management
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`heading-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Comment Management
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Review and manage blog comments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Comments
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {allComments.length}
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
                <AlertTriangle className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
            </div>

            <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Approved
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {approvedComments}
                  </p>
                </div>
                <Check className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search comments..."
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
                className={`w-full px-4 py-2 border rounded-lg ${isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                <option value="">All Comments</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
              </select>

              <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg ${isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                <option value="">All Posts</option>
                {posts.map((post) => (
                  <option key={post._id} value={post.slug}>
                    {post.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Comments ({filteredComments.length})
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading comments...</p>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No comments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Comment Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {comment.author.avatar ? (
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.fullname}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {comment.author.fullname}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            comment.isApproved
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {comment.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        {/* Comment Content */}
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.content}
                        </p>

                        {/* Comment Meta */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              On: {comment.postTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        {!comment.isApproved ? (
                          <button
                            onClick={() => handleApproveComment(comment._id)}
                            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRejectComment(comment._id)}
                            className="p-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
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
        </motion.div>
      </div>
    </div>
  )
}

export default CommentManagement
