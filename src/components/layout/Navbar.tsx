import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
    setIsUserMenuOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `backdrop-blur-lg ${isDark ? 'bg-secondary-900/80' : 'bg-white/80'} shadow-lg border-b ${isDark ? 'border-secondary-700' : 'border-gray-200'}` 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:shadow-glow`}>
                  <span className="text-white font-bold text-lg">CC</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold font-heading gradient-text`}>
                  City College
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sustainability Hub
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? `${isDark ? 'text-primary-400 bg-primary-900/20' : 'text-primary-600 bg-primary-50'}`
                    : `${isDark ? 'text-gray-300 hover:text-primary-400 hover:bg-secondary-800' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-yellow-400 hover:bg-secondary-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                    isDark ? 'hover:bg-secondary-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.fullname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className={`w-8 h-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                  <span className={`hidden sm:block font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.fullname}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  } ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.button>

                {/* User dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border ${
                        isDark 
                          ? 'bg-secondary-800 border-secondary-700' 
                          : 'bg-white border-gray-200'
                      } overflow-hidden`}
                    >
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-secondary-700' : 'border-gray-200'}`}>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {user?.fullname}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:bg-secondary-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard
                        </Link>
                        
                        {user?.role === 'admin' && (
                          <Link
                            to="/add-project"
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                              isDark 
                                ? 'text-gray-300 hover:bg-secondary-700' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Project
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-red-400 hover:bg-secondary-700' 
                              : 'text-red-600 hover:bg-gray-100'
                          }`}
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 hover:text-primary-400 hover:bg-secondary-800' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              ) : (
                <Bars3Icon className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t ${isDark ? 'border-secondary-700 bg-secondary-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-lg`}
            >
              <div className="px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? `${isDark ? 'text-primary-400 bg-primary-900/20' : 'text-primary-600 bg-primary-50'}`
                        : `${isDark ? 'text-gray-300 hover:text-primary-400 hover:bg-secondary-800' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-secondary-700">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 font-medium rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition-all duration-300"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center btn-primary"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
