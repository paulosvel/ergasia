import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import { useProjectStore, Project, ProjectFilters } from '@stores/projectStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Projects = () => {
  const { isDark } = useThemeStore()
  const { 
    projects, 
    pagination, 
    isLoading, 
    error, 
    fetchProjects, 
    clearError 
  } = useProjectStore()

  const [filters, setFilters] = useState<ProjectFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [filters])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const loadProjects = async () => {
    try {
      await fetchProjects(filters)
    } catch (error) {
      // Error handled by store and toast
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }))
  }

  const handleFilterChange = (key: keyof ProjectFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'In Progress':
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'On Hold':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (isLoading && projects.length === 0) {
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
            Sustainability Projects
          </h1>
          <p className={`body-large ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Explore our initiatives making a positive impact on the environment and our community.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Project Type Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Project Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">All Types</option>
                    <option value="Recycling">Recycling</option>
                    <option value="Zero Waste">Zero Waste</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Education">Education</option>
                    <option value="Research">Research</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">All Statuses</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="yearInitiated">Year Initiated</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Order
                  </label>
                  <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-secondary-800 border-secondary-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`card ${isDark ? 'card-dark' : ''} p-12 text-center`}
          >
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No projects found matching your criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/projects/${project._id}`}>
                  <div className={`card ${isDark ? 'card-dark' : ''} overflow-hidden h-full group-hover:shadow-xl transition-all duration-300`}>
                    {/* Project Image */}
                    {project.images && project.images.length > 0 && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.images.find(img => img.isPrimary)?.url || project.images[0].url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        {project.isFeatured && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title and Type */}
                      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-primary-600 transition-colors`}>
                        {project.title}
                      </h3>
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                        {project.type}
                      </p>

                      {/* Description */}
                      <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {project.description}
                      </p>

                      {/* Project Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {project.yearInitiated}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPinIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {project.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UsersIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {project.responsiblePerson}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <TagIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`text-xs px-2 py-1 rounded-md ${
                                isDark ? 'bg-secondary-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading indicator for pagination */}
        {isLoading && projects.length > 0 && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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

export default Projects
