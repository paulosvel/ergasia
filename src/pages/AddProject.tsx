import React from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '@stores/themeStore'

const AddProject = () => {
  const { isDark } = useThemeStore()

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`heading-2 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New Project
          </h1>
          
          <div className={`card ${isDark ? 'card-dark' : ''} p-8`}>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Project creation form will be implemented here with all the modern UI components.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AddProject
