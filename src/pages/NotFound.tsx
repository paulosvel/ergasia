import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'

const NotFound = () => {
  const { isDark } = useThemeStore()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="text-8xl font-bold text-transparent bg-gradient-to-br from-primary-500 to-accent-500 bg-clip-text">
              404
            </div>
          </motion.div>

          <motion.h1 
            className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Page Not Found
          </motion.h1>

          <motion.p 
            className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/"
              className="group btn-primary flex items-center justify-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className={`group font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isDark 
                  ? 'bg-secondary-800 text-white hover:bg-secondary-700' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              Go Back
            </button>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-accent-500/10 to-primary-500/10 rounded-full blur-xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
