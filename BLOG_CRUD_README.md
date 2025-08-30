# Blog CRUD and Commenting System

This document describes the blog management and commenting functionality that has been implemented for the sustainability platform.

## Features

### Blog Management (Admin Only)

- **Create Blog Posts**: Admins can create new blog posts with rich content
- **Edit Blog Posts**: Full editing capabilities for existing posts
- **Delete Blog Posts**: Remove posts with confirmation
- **Post Status Management**: Draft, Published, and Archived statuses
- **Featured Posts**: Mark posts as featured for special display
- **Public/Private Posts**: Control post visibility
- **Categories and Tags**: Organize posts with categories and tags
- **Featured Images**: Add images to posts via URL
- **Search and Filter**: Find posts by title, content, or status

### Comment System (All Authenticated Users)

- **Add Comments**: Logged-in users can comment on blog posts
- **Comment Approval**: Comments require admin approval before display
- **Comment Management**: Admins can approve, reject, or delete comments
- **Real-time Updates**: Comments appear immediately after approval
- **User Attribution**: Comments show author name and avatar

## Admin Pages

### 1. Blog Management (`/admin/blog`)

- **Access**: Admin users only
- **Features**:
  - Create new blog posts
  - Edit existing posts
  - Delete posts
  - Search and filter posts
  - Manage post status and visibility
  - Set featured posts

### 2. Comment Management (`/admin/comments`)

- **Access**: Admin users only
- **Features**:
  - View all comments across all posts
  - Approve pending comments
  - Reject inappropriate comments
  - Delete comments
  - Filter by status and post
  - Search comments by content or author

### 3. Admin Dashboard (`/admin`)

- **Access**: Admin users only
- **Features**:
  - Quick navigation to blog and comment management
  - User management (existing functionality)
  - Statistics overview

## User Experience

### For Regular Users

1. **Viewing Posts**: All users can view published blog posts
2. **Commenting**: Logged-in users can add comments to posts
3. **Comment Visibility**: Only approved comments are displayed
4. **Authentication Required**: Must be logged in to comment

### For Admins

1. **Full CRUD Access**: Complete control over blog posts
2. **Comment Moderation**: Approve/reject comments before they appear
3. **Content Management**: Organize posts with categories and tags
4. **Status Control**: Manage post visibility and publication status

## Technical Implementation

### Store Updates

- Enhanced `blogStore.ts` with comment management functions
- Added `approveComment`, `rejectComment`, and `deleteComment` methods
- Improved comment synchronization across posts

### New Components

- `BlogManagement.tsx`: Admin interface for blog CRUD
- `CommentManagement.tsx`: Admin interface for comment moderation

### Routing

- `/admin/blog`: Blog management page
- `/admin/comments`: Comment management page
- Protected routes requiring admin privileges

### API Endpoints (Expected)

The system expects these backend endpoints:

- `POST /blog` - Create blog post
- `PUT /blog/:id` - Update blog post
- `DELETE /blog/:id` - Delete blog post
- `POST /blog/:id/comments` - Add comment
- `PUT /blog/comments/:id/approve` - Approve comment
- `PUT /blog/comments/:id/reject` - Reject comment
- `DELETE /blog/comments/:id` - Delete comment

## Security Features

1. **Admin-Only Access**: Blog and comment management restricted to admin users
2. **Comment Moderation**: All comments require approval before display
3. **Authentication Required**: Users must be logged in to comment
4. **Protected Routes**: React Router protection for admin pages

## Usage Instructions

### Creating a Blog Post (Admin)

1. Navigate to `/admin/blog`
2. Click "New Post" button
3. Fill in the form:
   - Title (required)
   - Excerpt (optional)
   - Content (required)
   - Featured image URL (optional)
   - Categories (comma-separated)
   - Tags (comma-separated)
   - Status (draft/published/archived)
   - Public/Private toggle
   - Featured toggle
4. Click "Create Post"

### Managing Comments (Admin)

1. Navigate to `/admin/comments`
2. View all comments with their status
3. Use filters to find specific comments
4. Click approve (✓), reject (✗), or delete (🗑️) buttons
5. Comments are updated in real-time

### Adding Comments (Users)

1. Navigate to any blog post
2. Scroll to the comments section
3. If logged in, you'll see a comment form
4. Enter your comment and click "Post Comment"
5. Comment will be submitted for admin approval

## Future Enhancements

Potential improvements for the blog system:

- Rich text editor for blog content
- Image upload functionality
- Comment replies/threading
- Email notifications for comment approvals
- Blog post scheduling
- SEO optimization features
- Social media sharing
- Analytics and reporting

## Troubleshooting

### Common Issues

1. **Comments not appearing**: Check if they're approved by admin
2. **Cannot access admin pages**: Ensure user has admin role
3. **Form submission errors**: Check network connectivity and API endpoints
4. **Missing features**: Verify all required backend endpoints are implemented

### Support

For technical issues or feature requests, please refer to the main project documentation or contact the development team.
