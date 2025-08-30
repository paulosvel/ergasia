import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useThemeStore } from '@stores/themeStore'
import { useBlogStore } from '@stores/blogStore'
import { useAuthStore } from '@stores/authStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const { isDark } = useThemeStore()
  const { isAuthenticated } = useAuthStore()
  const { 
    currentPost, 
    isLoading, 
    error, 
    fetchPostBySlug, 
    toggleLike,
    addComment,
    clearError,
    setCurrentPost 
  } = useBlogStore()

  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPost(slug)
    }
    
    return () => {
      // Clear current post when component unmounts
      setCurrentPost(null)
    }
  }, [slug])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const loadPost = async (postSlug: string) => {
    try {
      await fetchPostBySlug(postSlug)
    } catch (error) {
      // Error handled by store and toast
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts')
      return
    }

    if (!currentPost || isLiking) return

    try {
      setIsLiking(true)
      await toggleLike(currentPost._id)
    } catch (error) {
      toast.error('Failed to toggle like')
    } finally {
      setIsLiking(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please log in to comment')
      return
    }

    if (!currentPost || !commentText.trim() || isSubmittingComment) return

    try {
      setIsSubmittingComment(true)
      await addComment(currentPost._id, commentText.trim())
      setCommentText('')
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    if (navigator.share && currentPost) {
      navigator.share({
        title: currentPost.title,
        text: currentPost.excerpt || '',
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className={`card ${isDark ? 'card-dark' : ''} p-8 text-center max-w-lg mx-auto`}>
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Blog Post Not Found
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const isLiked = currentPost.likes.includes('current-user') // This would need proper user ID checking

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link 
            to="/blog"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Categories and Featured Badge */}
            <div className="flex items-center gap-2 mb-4">
              {currentPost.isFeatured && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
              {currentPost.categories.map((category, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? 'bg-secondary-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
            
            <h1 className={`heading-1 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentPost.title}
            </h1>

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <UserIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {currentPost.author.fullname}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {formatDate(currentPost.publishedAt || currentPost.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <EyeIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {currentPost.views} views
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                    : isDark
                    ? 'border-secondary-700 text-white hover:bg-secondary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span>{currentPost.likes.length}</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'border-secondary-700 text-white hover:bg-secondary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </button>

              <div className="flex items-center gap-2">
                <ChatBubbleLeftIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {currentPost.comments.length} comments
                </span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          {currentPost.featuredImage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="aspect-video overflow-hidden rounded-xl">
                <img
                  src={currentPost.featuredImage}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`card ${isDark ? 'card-dark' : ''} p-8 mb-8`}
          >
            <div 
              className={`prose prose-lg max-w-none ${
                isDark ? 'prose-invert' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />

            {/* Tags */}
            {currentPost.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-secondary-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <TagIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  {currentPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDark ? 'bg-secondary-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`card ${isDark ? 'card-dark' : ''} p-8`}
          >
            <h3 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Comments ({currentPost.comments.length})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-secondary-800 border-secondary-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none`}
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className={`btn-primary ${
                      !commentText.trim() || isSubmittingComment ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={`p-4 rounded-lg border ${
                isDark ? 'border-secondary-700 bg-secondary-800' : 'border-gray-200 bg-gray-50'
              } mb-8`}>
                <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Link to="/login" className="text-primary-600 hover:text-primary-700">
                    Log in
                  </Link>
                  {' '}to join the conversation.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {currentPost.comments.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                currentPost.comments
                  .filter(comment => comment.isApproved)
                  .map((comment) => (
                    <motion.div 
                      key={comment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        isDark ? 'bg-secondary-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {comment.author.avatar ? (
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.fullname}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-secondary-700' : 'bg-gray-200'
                            }`}>
                              <UserIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {comment.author.fullname}
                            </span>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost