import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TagIcon,
  BanknotesIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import { useProjectStore } from '@stores/projectStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { isDark } = useThemeStore()
  const { 
    currentProject, 
    isLoading, 
    error, 
    fetchProjectById, 
    clearError,
    setCurrentProject 
  } = useProjectStore()

  useEffect(() => {
    if (id) {
      loadProject(id)
    }
    
    return () => {
      // Clear current project when component unmounts
      setCurrentProject(null)
    }
  }, [id])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const loadProject = async (projectId: string) => {
    try {
      await fetchProjectById(projectId)
    } catch (error) {
      // Error handled by store and toast
    }
  }

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className={`card ${isDark ? 'card-dark' : ''} p-8 text-center max-w-lg mx-auto`}>
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Project Not Found
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/projects"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

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
            to="/projects"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                    {currentProject.status}
                  </span>
                  {currentProject.isFeatured && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <h1 className={`heading-1 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentProject.title}
              </h1>
              
              <p className={`text-lg font-medium mb-6 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                {currentProject.type}
              </p>
            </motion.div>

            {/* Project Images */}
            {currentProject.images && currentProject.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProject.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-video overflow-hidden rounded-xl ${
                        image.isPrimary ? 'md:col-span-2' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.caption || currentProject.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {image.caption && (
                        <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`card ${isDark ? 'card-dark' : ''} p-8 mb-8`}
            >
              <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About This Project
              </h2>
              <div 
                className={`prose prose-lg max-w-none ${
                  isDark ? 'prose-invert' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: currentProject.description.replace(/\n/g, '<br>') }}
              />
            </motion.div>

            {/* Project Metrics */}
            {currentProject.metrics && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`card ${isDark ? 'card-dark' : ''} p-8 mb-8`}
              >
                <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Environmental Impact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProject.metrics.carbonReduction && (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <ChartBarIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentProject.metrics.carbonReduction.value} {currentProject.metrics.carbonReduction.unit}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Carbon Reduction
                      </p>
                    </div>
                  )}
                  
                  {currentProject.metrics.energySaved && (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                        <ChartBarIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentProject.metrics.energySaved.value} {currentProject.metrics.energySaved.unit}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Energy Saved
                      </p>
                    </div>
                  )}
                  
                  {currentProject.metrics.wasteReduced && (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentProject.metrics.wasteReduced.value} {currentProject.metrics.wasteReduced.unit}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Waste Reduced
                      </p>
                    </div>
                  )}
                  
                  {currentProject.metrics.peopleImpacted && (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <UsersIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentProject.metrics.peopleImpacted}+
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        People Impacted
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Project Details Card */}
              <div className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Project Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Year Initiated
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentProject.yearInitiated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPinIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Location
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentProject.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UsersIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Responsible Person
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentProject.responsiblePerson}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentProject.responsibleEmail}
                      </p>
                    </div>
                  </div>

                  {currentProject.departments && currentProject.departments.length > 0 && (
                    <div className="flex items-start gap-3">
                      <BuildingOfficeIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Departments
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentProject.departments.map((dept, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded ${
                                isDark ? 'bg-secondary-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentProject.budget && (
                    <div className="flex items-start gap-3">
                      <BanknotesIcon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Budget
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {currentProject.budget.allocated.toLocaleString()} {currentProject.budget.currency}
                        </p>
                        {currentProject.budget.spent > 0 && (
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Spent: {currentProject.budget.spent.toLocaleString()} {currentProject.budget.currency}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {currentProject.tags && currentProject.tags.length > 0 && (
                <div className={`card ${isDark ? 'card-dark' : ''} p-6 mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <TagIcon className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.map((tag, index) => (
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

              {/* Partners */}
              {currentProject.partners && currentProject.partners.length > 0 && (
                <div className={`card ${isDark ? 'card-dark' : ''} p-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Partners
                  </h3>
                  <ul className="space-y-2">
                    {currentProject.partners.map((partner, index) => (
                      <li 
                        key={index}
                        className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        • {partner}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail