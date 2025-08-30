import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '@stores/themeStore'
import { apiHelpers } from '@api/client'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Camera, X, Upload, Loader2 } from 'lucide-react'

interface ProjectFormData {
  title: string
  departments: string[]
  type: string
  description: string
  partners: string
  responsiblePerson: string
  responsibleEmail: string
  yearInitiated: number
  status: string
  location: string
}

const AddProject = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    departments: [],
    type: 'Recycling',
    description: '',
    partners: '',
    responsiblePerson: '',
    responsibleEmail: '',
    yearInitiated: new Date().getFullYear(),
    status: 'Ongoing',
    location: ''
  })

  const projectTypes = [
    'Recycling',
    'Zero Waste',
    'Seminar',
    'Energy',
    'Water',
    'Transportation',
    'Education',
    'Research',
    'Other'
  ]

  const projectStatuses = [
    'Planning',
    'In Progress',
    'Ongoing',
    'Completed',
    'On Hold',
    'Cancelled'
  ]

  const departmentOptions = [
    'Computer Science',
    'Engineering',
    'Business',
    'Marketing',
    'Management',
    'Facilities',
    'Student Affairs',
    'Research',
    'Administration'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearInitiated' ? parseInt(value) : value
    }))
  }

  const handleDepartmentChange = (department: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      departments: checked
        ? [...prev.departments, department]
        : prev.departments.filter(d => d !== department)
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (selectedImages.length + files.length > 5) {
        toast.error('Maximum 5 images allowed')
        return
      }
      setSelectedImages(prev => [...prev, ...files])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.departments.length === 0) {
      toast.error('Please select at least one department')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'departments') {
          // Send departments as individual form fields for backend parsing
          (value as string[]).forEach(dept => {
            submitData.append('departments', dept)
          })
        } else {
          submitData.append(key, value.toString())
        }
      })

      // Add images
      selectedImages.forEach((file, index) => {
        submitData.append('images', file)
      })

      const response = await apiHelpers.upload('/projects', submitData)

      toast.success('Project created successfully!')
      navigate('/projects')
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast.error(error.response?.data?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`heading-2 mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add Sustainability Project
          </h1>

          <div className={`card ${isDark ? 'card-dark' : ''} p-8 max-w-4xl mx-auto`}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Title */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                  placeholder="Enter project title"
                  required
                />
              </div>

              {/* Departments */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Departments Involved *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {departmentOptions.map((dept) => (
                    <label key={dept} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${formData.departments.includes(dept)
                        ? isDark
                          ? 'bg-primary-900/30 border-primary-500 text-primary-300'
                          : 'bg-primary-50 border-primary-500 text-primary-700'
                        : isDark
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}>
                      <input
                        type="checkbox"
                        checked={formData.departments.includes(dept)}
                        onChange={(e) => handleDepartmentChange(dept, e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Type & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Project Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    required
                  >
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Project Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    required
                  >
                    {projectStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Project Images (Max 5)
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                  }`}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Click to upload images or drag and drop
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`input-field ${isDark ? 'input-field-dark' : ''} resize-none`}
                  placeholder="Describe the project goals, activities, and expected outcomes..."
                  required
                />
              </div>

              {/* Partners & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    External Partners
                  </label>
                  <input
                    type="text"
                    name="partners"
                    value={formData.partners}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    placeholder="e.g., Municipality, NGOs, Companies (comma-separated)"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Project Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    placeholder="e.g., Campus, City College Building A"
                    required
                  />
                </div>
              </div>

              {/* Responsible Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Responsible Person *
                  </label>
                  <input
                    type="text"
                    name="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    placeholder="Full name of project manager"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Responsible Email *
                  </label>
                  <input
                    type="email"
                    name="responsibleEmail"
                    value={formData.responsibleEmail}
                    onChange={handleInputChange}
                    className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                    placeholder="contact@example.com"
                    required
                  />
                </div>
              </div>

              {/* Year Initiated */}
              <div className="max-w-xs">
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Year Initiated *
                </label>
                <input
                  type="number"
                  name="yearInitiated"
                  value={formData.yearInitiated}
                  onChange={handleInputChange}
                  min="2000"
                  max={new Date().getFullYear() + 10}
                  className={`input-field ${isDark ? 'input-field-dark' : ''}`}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AddProject
