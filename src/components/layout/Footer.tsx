import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'

const Footer = () => {
  const { isDark } = useThemeStore()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'Team', href: '/about#team' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Initiatives', href: '/initiatives' },
      { name: 'Projects', href: '/projects' },
      { name: 'Blog', href: '/blog' },
      { name: 'Gallery', href: '/gallery' },
    ],
    connect: [
      { name: 'Facebook', href: '#', external: true },
      { name: 'Instagram', href: '#', external: true },
      { name: 'LinkedIn', href: '#', external: true },
      { name: 'Twitter', href: '#', external: true },
    ]
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      text: 'City College Campus, Sustainability Building',
      subText: 'Athens, Greece'
    },
    {
      icon: PhoneIcon,
      text: '+30 210 123 4567',
      subText: 'Mon-Fri 9:00-17:00'
    },
    {
      icon: EnvelopeIcon,
      text: 'sustainability@citycollege.edu',
      subText: 'We reply within 24 hours'
    }
  ]

  return (
    <footer className={`relative ${isDark ? 'bg-secondary-900' : 'bg-gray-50'} border-t ${isDark ? 'border-secondary-700' : 'border-gray-200'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${isDark ? 'bg-primary-900/10' : 'bg-primary-100/50'} blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${isDark ? 'bg-accent-900/10' : 'bg-accent-100/50'} blur-3xl`} />
      </div>

      <div className="relative container-custom px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Logo and description */}
                <div>
                  <Link to="/" className="flex items-center space-x-3 group w-fit">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:shadow-glow`}>
                        <span className="text-white font-bold text-xl">CC</span>
                      </div>
                    </div>
                    <div>
                      <h1 className={`text-xl font-bold font-heading gradient-text`}>
                        City College
                      </h1>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sustainability Hub
                      </p>
                    </div>
                  </Link>
                  
                  <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
                    Building a sustainable future through innovation, education, and community engagement. 
                    Join us in creating positive environmental impact that lasts for generations.
                  </p>
                </div>

                {/* Contact info */}
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-secondary-800' : 'bg-primary-50'}`}>
                        <item.icon className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                          {item.text}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {item.subText}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              {/* Company links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className={`text-sm transition-colors duration-300 ${
                          isDark 
                            ? 'text-gray-400 hover:text-primary-400' 
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className={`text-sm transition-colors duration-300 ${
                          isDark 
                            ? 'text-gray-400 hover:text-primary-400' 
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Social links */}
                <div className="mt-6">
                  <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
                    Follow Us
                  </h4>
                  <div className="flex space-x-3">
                    {footerLinks.connect.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          isDark 
                            ? 'bg-secondary-800 text-gray-400 hover:bg-primary-600 hover:text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        {link.name.charAt(0)}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`py-6 border-t ${isDark ? 'border-secondary-700' : 'border-gray-200'}`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                © {currentYear} City College Sustainability Hub. All rights reserved.
              </p>
              <div className="hidden sm:flex items-center space-x-4">
                <Link 
                  to="/privacy" 
                  className={`text-xs transition-colors duration-300 ${
                    isDark 
                      ? 'text-gray-400 hover:text-primary-400' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className={`text-xs transition-colors duration-300 ${
                    isDark 
                      ? 'text-gray-400 hover:text-primary-400' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with
              </p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <HeartIcon className={`w-3 h-3 ${isDark ? 'text-red-400' : 'text-red-500'} fill-current`} />
              </motion.div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                for our planet
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
