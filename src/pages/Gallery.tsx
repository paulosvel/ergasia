import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@stores/themeStore'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
  description: string
}

const Gallery = () => {
  const { isDark } = useThemeStore()
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: '../images/treeplanting.jpeg',
      alt: 'Tree Planting Initiative',
      category: 'environment',
      description: 'Students participating in our annual tree planting campaign'
    },
    {
      id: 2,
      src: '../images/solarpanel.jpeg',
      alt: 'Solar Panel Installation',
      category: 'energy',
      description: 'Solar panels installed on campus buildings for renewable energy'
    },
    {
      id: 3,
      src: '../images/recyclingcampaign.jpeg',
      alt: 'Recycling Campaign',
      category: 'waste',
      description: 'Campus-wide recycling awareness campaign'
    },
    {
      id: 4,
      src: '../images/bikesharing.jpeg',
      alt: 'Bike Sharing Program',
      category: 'transport',
      description: 'Sustainable transportation with our bike sharing program'
    },
    {
      id: 5,
      src: '../images/studentvolunteers.jpeg',
      alt: 'Student Volunteers',
      category: 'community',
      description: 'Dedicated student volunteers working on sustainability projects'
    },
    {
      id: 6,
      src: '../images/campusgarden.jpeg',
      alt: 'Campus Garden',
      category: 'environment',
      description: 'Beautiful campus garden maintained by students and staff'
    },
    {
      id: 7,
      src: '../images/giwtis.jpeg',
      alt: 'Sustainability Workshop',
      category: 'education',
      description: 'Educational workshop on sustainable practices'
    },
    {
      id: 8,
      src: '../images/Karaflas.jpeg',
      alt: 'Faculty Member',
      category: 'people',
      description: 'Faculty member leading sustainability initiatives'
    },
    {
      id: 9,
      src: '../images/papadopoulos.jpeg',
      alt: 'Research Project',
      category: 'research',
      description: 'Research project on environmental sustainability'
    },
    {
      id: 10,
      src: '../images/sifis.jpeg',
      alt: 'Student Project',
      category: 'projects',
      description: 'Student-led sustainability project presentation'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'environment', name: 'Environment' },
    { id: 'energy', name: 'Energy' },
    { id: 'waste', name: 'Waste Management' },
    { id: 'transport', name: 'Transportation' },
    { id: 'community', name: 'Community' },
    { id: 'education', name: 'Education' },
    { id: 'people', name: 'People' },
    { id: 'research', name: 'Research' },
    { id: 'projects', name: 'Projects' }
  ]

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`heading-2 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Photo Gallery
          </h1>
          
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore our sustainability initiatives through our photo gallery. 
            Click on any image to view it in full size.
          </p>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                    <div className="p-4 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {image.alt}
                      </h3>
                      <p className="text-gray-200 text-xs">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={closeLightbox}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-4xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeLightbox}
                    className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
                  >
                    ×
                  </button>
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {selectedImage.alt}
                    </h3>
                    <p className="text-gray-300">
                      {selectedImage.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Gallery
