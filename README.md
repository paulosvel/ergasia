# 🌱 City College Sustainability Hub

A modern, cutting-edge web platform for City College's sustainability initiatives, built with React, TypeScript, and Express.js.

## ✨ Features

### 🎨 Modern UI/UX

- **Cutting-edge design** with glassmorphism effects
- **Dark/Light mode** with smooth transitions
- **Responsive layout** optimized for all devices
- **Micro-interactions** and smooth animations
- **Material Design 3.0** inspired components

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure cookies
- **Role-based access control** (User/Admin)
- **Password strength validation**
- **Account management** features

### 📊 Content Management

- **Project management** with rich media support
- **Blog system** with comments and categories
- **Photo gallery** with lightbox functionality
- **Real-time statistics** and metrics

### 🚀 Performance & Security

- **Optimized bundle** with code splitting
- **Image optimization** and lazy loading
- **Rate limiting** and security headers
- **MongoDB** with optimized queries

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Zustand** for state management
- **React Hook Form** for form handling

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security
- **Express Validator** for input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd city-college-sustainability
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create upload directories**

   ```bash
   mkdir -p uploads/projects uploads/blog uploads/avatars uploads/general
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:

- Frontend development server on `http://localhost:3000`
- Backend API server on `http://localhost:5000`

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── auth/          # Authentication components
│   │   └── ui/            # UI components (Button, Modal, etc.)
│   ├── pages/             # Page components
│   ├── stores/            # Zustand state stores
│   ├── api/               # API client and helpers
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── server/                # Backend source code
│   ├── routes/            # API route handlers
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Express middleware
│   └── config/            # Configuration files
├── uploads/               # File upload directory
└── dist/                  # Production build output
```

## 🎯 Key Features Implementation

### Authentication System

- Secure JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control
- Session management

### Project Management

- CRUD operations for sustainability projects
- File upload with image optimization
- Advanced filtering and search
- Project metrics and statistics

### Blog System

- Rich text content management
- Comment system with moderation
- Category and tag organization
- SEO-friendly URLs

### Modern UI Components

- Responsive navigation with mobile menu
- Dark/light theme toggle
- Loading states and error handling
- Form validation with real-time feedback

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/logout` - User logout

### Projects

- `GET /api/projects` - Get projects (with filtering)
- `POST /api/projects` - Create project (Admin)
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Blog

- `GET /api/blog` - Get blog posts
- `POST /api/blog` - Create post (Admin)
- `GET /api/blog/:slug` - Get single post
- `POST /api/blog/:id/comments` - Add comment

### File Upload

- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `POST /api/upload/avatar` - Upload user avatar

## 🌐 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

### Deployment Platforms

- **Vercel/Netlify** for frontend
- **Railway/Render** for backend
- **MongoDB Atlas** for database
- **Cloudinary** for image hosting (recommended)

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS** configuration
- **JWT** with secure cookie storage
- **Password hashing** with bcrypt

## 🎨 Design System

### Colors

- **Primary**: Green (#22c55e) - Environmental theme
- **Secondary**: Slate gray - Modern neutral
- **Accent**: Emerald (#10b981) - Sustainability focus

### Typography

- **Headings**: Poppins (bold, modern)
- **Body**: Inter (readable, clean)

### Components

- Consistent spacing and sizing
- Smooth transitions and animations
- Accessibility-first design
- Mobile-responsive layouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- City College sustainability team
- React and Node.js communities
- Open source contributors

---

**Built with 💚 for a sustainable future**
