import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { useThemeStore } from '@stores/themeStore'
import toast from 'react-hot-toast'
import { getEmailJSConfig  } from '../config/emailjs'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Building
} from 'lucide-react'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const Contact = () => {
  const { isDark } = useThemeStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    try {

      const config = getEmailJSConfig()
      const result = await emailjs.sendForm(
        config.SERVICE_ID,
        config.TEMPLATE_ID,
        formRef.current!,
        config.PUBLIC_KEY
      )
      console.log('result', result)

      if (result.status === 200) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        reset()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      toast.error('Failed to send message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'sustainability@citycollege.edu',
      link: 'mailto:sustainability@citycollege.edu'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+30 210 1234567',
      link: 'tel:+302101234567'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Green Way, EcoCity, 10000',
      link: 'https://maps.google.com/?q=123+Green+Way+EcoCity+10000'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      value: 'Mon-Fri: 9:00 AM - 5:00 PM',
      link: null
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`heading-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Get in Touch
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions, suggestions, or want to contribute to our sustainability efforts? 
              We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={`card ${isDark ? 'card-dark' : ''} p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Send us a Message
                </h2>
                
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      Full Name *
                    </label>
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      id="name"
                      name="name"
                      className={`input-field ${isDark ? 'input-field-dark' : ''} ${
                        errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      Email Address *
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
                      id="email"
                      name="email"
                      className={`input-field ${isDark ? 'input-field-dark' : ''} ${
                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your email address"
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

                  {/* Subject Field */}
                  <div>
                    <label 
                      htmlFor="subject" 
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      Subject *
                    </label>
                    <input
                      {...register('subject', {
                        required: 'Subject is required',
                        minLength: {
                          value: 5,
                          message: 'Subject must be at least 5 characters'
                        }
                      })}
                      type="text"
                      id="subject"
                      name="subject"
                      className={`input-field ${isDark ? 'input-field-dark' : ''} ${
                        errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="What is this about?"
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.subject.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label 
                      htmlFor="message" 
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      Message *
                    </label>
                    <textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                      id="message"
                      name="message"
                      rows={5}
                      className={`input-field ${isDark ? 'input-field-dark' : ''} resize-none ${
                        errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`card ${isDark ? 'card-dark' : ''} p-6 hover:shadow-lg transition-all duration-200`}>
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                          <info.icon className={`w-6 h-6 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className={`text-sm hover:text-primary-600 transition-colors ${
                                isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600'
                              }`}
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className={`card ${isDark ? 'card-dark' : ''} p-6`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Building className={`w-6 h-6 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    City College Sustainability Office
                  </h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Our dedicated team is here to help you with any questions about our sustainability 
                  initiatives, projects, or how you can get involved.
                </p>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                      We typically respond within 24 hours
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16"
          >
            <div className={`card ${isDark ? 'card-dark' : ''} p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Our Location
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.021108932669!2d23.7293594153712!3d37.98380997971727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1d373a127f%3A0x31472eec99a59dc7!2sAthens!5e0!3m2!1sen!2sgr!4v1623235689208!5m2!1sen!2sgr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="City College Location"
                />
              </div>
            </div>
          </motion.div>

          {/* EmailJS Setup Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8"
          >
            <div className={`card ${isDark ? 'card-dark' : ''} p-6 border-l-4 border-yellow-500`}>
              <div className="flex items-start space-x-3">
                <AlertCircle className={`w-6 h-6 text-yellow-500 mt-1`} />
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    EmailJS Setup Required
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    To enable the contact form functionality, you need to set up EmailJS:
                  </p>
                                     <ol className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                     <li>1. Sign up at <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">emailjs.com</a></li>
                     <li>2. Create an email service (Gmail, Outlook, etc.)</li>
                     <li>3. Create an email template</li>
                     <li>4. Update your credentials in <code className="bg-gray-100 px-1 rounded">src/config/emailjs.ts</code></li>
                     <li>5. See <code className="bg-gray-100 px-1 rounded">EMAILJS_SETUP_GUIDE.md</code> for detailed instructions</li>
                   </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
