import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import LoadingSpinner from '@components/ui/LoadingSpinner'

interface RegisterForm {
  fullname: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        fullname: data.fullname,
        email: data.email,
        password: data.password
      })
      toast.success('Account created successfully! Welcome to City College!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    }
  }

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ]
    
    strength = checks.filter(Boolean).length
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    
    return {
      strength,
      label: labels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || 'bg-red-500'
    }
  }

  const passwordStrength = getPasswordStrength(password)

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
            Join our community
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Create your sustainability account and make a difference
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`card ${isDark ? 'card-dark' : ''} p-8 shadow-2xl`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full name field */}
            <div>
              <label 
                htmlFor="fullname" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Full name
              </label>
              <input
                {...register('fullname', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
                type="text"
                autoComplete="name"
                className={`input-field ${isDark ? 'input-field-dark' : ''} ${
                  errors.fullname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullname && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.fullname.message}
                </motion.p>
              )}
            </div>

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
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field ${isDark ? 'input-field-dark' : ''} pr-12 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Create a password"
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
              
              {/* Password strength indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </motion.div>
              )}
              
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

            {/* Confirm password field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field ${isDark ? 'input-field-dark' : ''} pr-12 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Terms acceptance */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  id="accept-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor="accept-terms" 
                  className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {errors.acceptTerms && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errors.acceptTerms.message}
              </motion.p>
            )}

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
                  Creating account...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Create account
                </>
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className={`w-full btn-secondary text-center block`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
