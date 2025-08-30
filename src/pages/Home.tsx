import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { 
  ArrowRightIcon,
  PuzzlePieceIcon as LeafIcon,
  LightBulbIcon,
  UsersIcon,
  GlobeAltIcon,
  TrophyIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import { useProjectStore } from '@stores/projectStore'

const Home = () => {
  const { isDark } = useThemeStore()
  const { stats, fetchProjectStats } = useProjectStore()
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  useEffect(() => {
    // Fetch project stats when component mounts
    fetchProjectStats()
  }, [])

  const statsDisplay = [
    {
      icon: GlobeAltIcon,
      number: stats?.overview?.totalProjects || 0,
      label: 'Total Projects',
      suffix: '',
      color: 'text-purple-500'
    },
    {
      icon: LightBulbIcon,
      number: stats?.overview?.activeProjects || 0,
      label: 'Active Projects',
      suffix: '',
      color: 'text-yellow-500'
    },
    {
      icon: TrophyIcon,
      number: stats?.overview?.completedProjects || 0,
      label: 'Completed Projects',
      suffix: '',
      color: 'text-green-500'
    },
    {
      icon: UsersIcon,
      number: stats?.overview?.totalPeopleImpacted || 0,
      label: 'People Impacted',
      suffix: '+',
      color: 'text-blue-500'
    }
  ]

  const features = [
    {
      icon: LeafIcon,
      title: 'Environmental Innovation',
      description: 'Pioneering sustainable solutions for a greener campus and community through cutting-edge research and implementation.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: LightBulbIcon,
      title: 'Smart Energy Systems',
      description: 'Implementing intelligent energy management systems that reduce consumption and promote renewable energy adoption.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: UsersIcon,
      title: 'Community Engagement',
      description: 'Building a network of environmentally conscious individuals committed to creating lasting positive change.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrophyIcon,
      title: 'Measurable Impact',
      description: 'Tracking and celebrating our environmental achievements with transparent metrics and real-world results.',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/background.jpeg" 
            alt="Sustainability background"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'}`} />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-500/20 to-primary-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.h1 
              className="heading-1 text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Building a{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Sustainable Future
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
              {' '}Together
            </motion.h1>
            
            <motion.p 
              className="body-large text-gray-200 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join City College's sustainability initiative where innovation meets environmental responsibility. 
              Together, we're creating positive change that will impact generations to come.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/initiatives"
                className="group btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-glow"
              >
                Explore Initiatives
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link 
                to="/about"
                className="group bg-white/10 backdrop-blur-lg text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                Learn More
                <ChevronRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white dark:bg-secondary-900 relative">
        <div className="container-custom">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="heading-2 text-gray-900 dark:text-white mb-4"
            >
              Our Environmental Impact
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Real numbers, real change. See how our community is making a difference.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsDisplay.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={controls}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className={`card ${isDark ? 'card-dark' : ''} p-8 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                      stat.color === 'text-green-500' ? 'from-green-500 to-emerald-600' :
                      stat.color === 'text-yellow-500' ? 'from-yellow-500 to-orange-600' :
                      stat.color === 'text-blue-500' ? 'from-blue-500 to-indigo-600' :
                      'from-purple-500 to-pink-600'
                    } flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                      <CountUpAnimation target={stat.number} suffix={stat.suffix} />
                    </motion.div>
                    
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50 dark:bg-secondary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Why Choose Sustainability?
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive approach combines innovation, education, and community action to create lasting environmental change.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className={`card ${isDark ? 'card-dark' : ''} p-8 h-full relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="heading-2 text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="body-large text-green-100 mb-8">
              Join our community of changemakers and help us build a more sustainable future. 
              Every action counts, and together we can create lasting impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Join Our Community
              </Link>
              <Link 
                to="/contact"
                className="bg-white/10 backdrop-blur-lg text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// CountUp Animation Component
const CountUpAnimation = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = React.useState(0)
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = target / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }
  }, [inView, target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default Home
