import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'

interface LoginForm {
  email: string
  password: string
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
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
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-accent-500/10 to-primary-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 mb-6"
          >
            <span className="text-white font-bold text-xl">CC</span>
          </motion.div>
          
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your sustainability account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`card ${isDark ? 'card-dark' : ''} p-8 shadow-2xl`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                autoComplete="email"
                className={`input-field ${isDark ? 'input-field-dark' : ''} ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field ${isDark ? 'input-field-dark' : ''} pr-12 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className={`ml-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDark 
                    ? 'text-primary-400 hover:text-primary-300' 
                    : 'text-primary-600 hover:text-primary-500'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-secondary-700' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDark ? 'bg-secondary-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  New to City College?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className={`w-full btn-secondary text-center block`}
              >
                Create an account
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="underline hover:no-underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
