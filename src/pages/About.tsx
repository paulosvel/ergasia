import React from 'react'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'

const About = () => {
  const { isDark } = useThemeStore()

  const values = [
    {
      icon: GlobeAltIcon,
      title: 'Environmental Stewardship',
      description: 'We are committed to protecting and preserving our planet for future generations through responsible action and sustainable practices.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation & Research',
      description: 'We foster cutting-edge research and innovative solutions to address the most pressing environmental challenges of our time.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: UsersIcon,
      title: 'Community Engagement',
      description: 'We believe in the power of collective action and work to engage students, faculty, and the broader community in sustainability efforts.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: AcademicCapIcon,
      title: 'Education & Awareness',
      description: 'We strive to educate and raise awareness about environmental issues and sustainable living practices through various programs.',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const team = [
    {
      name: 'Dr. Maria Papadopoulos',
      role: 'Director of Sustainability',
      image: '/images/papadopoulos.jpeg',
      bio: 'Leading sustainability projects with over 15 years of environmental research experience.'
    },
    {
      name: 'Prof. Nikos Karaflas',
      role: 'Environmental Science',
      image: '/images/Karaflas.jpeg',
      bio: 'Expert in renewable energy systems and sustainable technology implementation.'
    },
    {
      name: 'Dr. Sophia Giwtis',
      role: 'Community Outreach',
      image: '/images/giwtis.jpeg',
      bio: 'Specializes in community engagement and environmental education programs.'
    },
    {
      name: 'Alex Sifis',
      role: 'Student Coordinator',
      image: '/images/sifis.jpeg',
      bio: 'Passionate student leader driving campus sustainability projects and student engagement.'
    }
  ]

  const achievements = [
    {
      icon: TrophyIcon,
      title: 'Green Campus Award 2023',
      description: 'Recognized for outstanding environmental projects'
    },
    {
      icon: GlobeAltIcon,
      title: 'Carbon Neutral Certification',
      description: 'Achieved carbon neutrality through renewable energy and offsetting'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation in Sustainability',
      description: 'Awarded for groundbreaking research in sustainable technologies'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/campusgarden.jpeg" 
            alt="Campus sustainability"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'}`} />
        </div>
        
        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="heading-1 text-white mb-6">
              About Our{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Sustainability Mission
              </span>
            </h1>
            <p className="body-large text-gray-200 max-w-3xl mx-auto">
              At City College, we're committed to creating a sustainable future through education, 
              innovation, and community action. Our sustainability hub serves as a catalyst for 
              positive environmental change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <div className={`max-w-4xl mx-auto p-8 rounded-2xl ${isDark ? 'bg-secondary-800' : 'bg-primary-50'}`}>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                To foster environmental awareness, promote sustainable practices, and inspire 
                innovative solutions that contribute to a healthier planet. We strive to educate 
                our community, conduct meaningful research, and implement practical projects 
                that make a lasting positive impact on our environment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core Values
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These fundamental principles guide our approach to sustainability and shape 
              every projects we undertake.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
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
                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our dedicated team of educators, researchers, and students working together 
              to create a more sustainable future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className={`card ${isDark ? 'card-dark' : ''} p-6 text-center`}>
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                    {member.role}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
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
              Our Achievements
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Recognition for our commitment to environmental excellence and sustainable innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className={`card ${isDark ? 'card-dark' : ''} p-8 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {achievement.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300">
                      {achievement.description}
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
              Join Our Sustainability Journey
            </h2>
            <p className="body-large text-green-100 mb-8">
              Whether you're a student, faculty member, or community supporter, 
              there are many ways to get involved in our sustainability projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl"
              >
                Get Involved
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
