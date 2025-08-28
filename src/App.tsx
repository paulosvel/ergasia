import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'

// Layout components
import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'

// Pages
import Home from '@pages/Home'
import About from '@pages/About'
import Initiatives from '@pages/Initiatives'
import Blog from '@pages/Blog'
import BlogPost from '@pages/BlogPost'
import Gallery from '@pages/Gallery'
import Contact from '@pages/Contact'
import Login from '@pages/auth/Login'
import Register from '@pages/auth/Register'
import Dashboard from '@pages/Dashboard'
import AddProject from '@pages/AddProject'
import Projects from '@pages/Projects'
import ProjectDetail from '@pages/ProjectDetail'
import NotFound from '@pages/NotFound'

// Protected route component
import ProtectedRoute from '@components/auth/ProtectedRoute'

function App() {
  const { checkAuth } = useAuthStore()
  const { isDark } = useThemeStore()

  useEffect(() => {
    // Check authentication status on app load
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      isDark ? 'gradient-bg-dark' : 'gradient-bg'
    }`}>
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/add-project" element={
            <ProtectedRoute requireAdmin>
              <AddProject />
            </ProtectedRoute>
          } />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
