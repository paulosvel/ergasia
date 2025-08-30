import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import { useBlogStore, BlogFilters } from '@stores/blogStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Blog = () => {
  const { isDark } = useThemeStore()
  const { 
    posts, 
    featuredPosts,
    categories,
    tags,
    pagination, 
    isLoading, 
    error, 
    fetchPosts,
    fetchFeaturedPosts,
    fetchCategories,
    fetchTags,
    clearError 
  } = useBlogStore()

  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 10
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadBlogData()
  }, [filters])

  useEffect(() => {
    // Load initial data
    fetchFeaturedPosts()
    fetchCategories()
    fetchTags()
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const loadBlogData = async () => {
    try {
      await fetchPosts(filters)
    } catch (error) {
      // Error handled by store and toast
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }))
  }

  const handleFilterChange = (key: keyof BlogFilters, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className={`heading-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sustainability Blog
          </h1>
          <p className={`body-large ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Stay updated with the latest news, insights, and stories from our sustainability journey.
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className={`card ${isDark ? 'card-dark' : ''} overflow-hidden h-full group-hover:shadow-xl transition-all duration-300`}>
                      {post.featuredImage && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          {post.categories.length > 0 && (
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {post.categories[0]}
                            </span>
                          )}
                        </div>
                        
                        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-primary-600 transition-colors line-clamp-2`}>
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {post.author.fullname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-secondary-800 border-secondary-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border ${
                isDark
                  ? 'bg-secondary-800 border-secondary-700 text-white hover:bg-secondary-700'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              } transition-colors duration-200`}
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category._id} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Tag
                  </label>
                  <select
                    value={filters.tag || ''}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag._id} ({tag.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Featured
                  </label>
                  <select
                    value={filters.featured?.toString() || ''}
                    onChange={(e) => handleFilterChange('featured', e.target.value === 'true')}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">All Posts</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Non-Featured</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Blog Posts */}
        {posts.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`card ${isDark ? 'card-dark' : ''} p-12 text-center`}
          >
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No blog posts found matching your criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className={`card ${isDark ? 'card-dark' : ''} overflow-hidden h-full group-hover:shadow-xl transition-all duration-300`}>
                    <div className="flex flex-col md:flex-row h-full">
                      {post.featuredImage && (
                        <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className={`${post.featuredImage ? 'md:w-2/3' : 'w-full'} p-6 flex flex-col justify-between`}>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            {post.isFeatured && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                            {post.categories.length > 0 && (
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {post.categories[0]}
                              </span>
                            )}
                          </div>
                          
                          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-primary-600 transition-colors line-clamp-2`}>
                            {post.title}
                          </h3>
                          
                          {post.excerpt && (
                            <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {post.excerpt}
                            </p>
                          )}

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap mb-4">
                              <TagIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className={`text-xs px-2 py-1 rounded-md ${
                                    isDark ? 'bg-secondary-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {post.author.fullname}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <HeartIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {post?.likes?.length}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ChatBubbleLeftIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {post?.comments?.length}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {formatDate(post?.publishedAt || post?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading indicator for pagination */}
        {isLoading && posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg border ${
                  pagination.page === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-50 dark:hover:bg-secondary-700'
                } ${
                  isDark 
                    ? 'border-secondary-700 text-white' 
                    : 'border-gray-300 text-gray-900'
                } transition-colors`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg border ${
                      pagination.page === pageNum
                        ? 'bg-primary-600 text-white border-primary-600'
                        : isDark
                        ? 'border-secondary-700 text-white hover:bg-secondary-700'
                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg border ${
                  pagination.page === pagination.pages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-50 dark:hover:bg-secondary-700'
                } ${
                  isDark 
                    ? 'border-secondary-700 text-white' 
                    : 'border-gray-300 text-gray-900'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Blog