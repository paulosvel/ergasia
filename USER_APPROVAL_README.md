# User Approval System

This document explains the user approval system implemented in the City College Sustainability Platform.

## Overview

The platform now includes a user approval system where new user registrations require admin approval before they can log in and access the platform features.

## Features

### For Users

- Users can register normally through the registration form
- After registration, users receive a message that their account is pending approval
- Users cannot log in until their account is approved by an admin
- Users see a notification on their dashboard if their account is still pending approval

### For Admins

- Admins can view all registered users in the admin dashboard
- Admins can approve or reject user accounts
- Admins can change user roles (user/admin)
- Admins can delete user accounts
- Admin dashboard shows statistics about user registrations

## Database Changes

### User Model Updates

- Added `approved` field (Boolean, default: false)
- Added index on `approved` field for performance

### New Admin Routes

- `GET /api/admin/users` - Get all users with pagination and filtering
- `PUT /api/admin/users/:userId/approve` - Approve a user
- `PUT /api/admin/users/:userId/reject` - Reject a user
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete a user
- `GET /api/admin/stats` - Get admin dashboard statistics

## Authentication Flow

### Registration

1. User fills out registration form
2. Account is created with `approved: false`
3. User receives success message about pending approval
4. User is redirected to dashboard (but cannot access protected features)

### Login

1. User attempts to log in
2. System checks if user is approved (except for admins)
3. If not approved, login is rejected with appropriate message
4. If approved, login proceeds normally

## Admin Dashboard

### Features

- **Statistics Cards**: Total users, pending approvals, approved users, admins, recent registrations
- **User Management Table**:
  - Search users by name or email
  - Filter by approval status
  - Pagination support
  - Actions: Approve/Reject, Change Role, Delete
- **Real-time Updates**: Stats and user list update after actions

### Access Control

- Only users with `role: 'admin'` can access the admin dashboard
- Admins cannot delete their own account
- Admins cannot change their own role

## Setup Instructions

### 1. Create First Admin User

Run the following command to create the first admin user:

```bash
npm run create-admin
```

This will create an admin user with:

- Email: `admin@citycollege.edu`
- Password: `Admin123!`
- Role: `admin`
- Status: `approved`

**Important**: Change the password after first login!

### 2. Database Migration

If you have existing users in your database, you may need to update them:

```javascript
// In MongoDB shell or through your application
db.users.updateMany({}, { $set: { approved: false } });
db.users.updateMany({ role: "admin" }, { $set: { approved: true } });
```

### 3. Frontend Routes

The admin dashboard is accessible at `/admin` for users with admin privileges.

## Security Considerations

1. **Admin Protection**: Admin routes are protected by middleware that checks user role
2. **Self-Protection**: Admins cannot delete or change their own role
3. **Approval Required**: All non-admin users must be approved before login
4. **Role Validation**: Only valid roles ('user', 'admin') are accepted

## API Endpoints

### Admin Routes (Protected)

```
GET    /api/admin/users?page=1&limit=10&status=pending&search=john
PUT    /api/admin/users/:userId/approve
PUT    /api/admin/users/:userId/reject
PUT    /api/admin/users/:userId/role
DELETE /api/admin/users/:userId
GET    /api/admin/stats
```

### Updated Auth Routes

```
POST   /api/auth/register  # Now sets approved: false
POST   /api/auth/login     # Now checks approved status
GET    /api/auth/status    # Now includes approved field
```

## Error Messages

### Registration

- Success: "Account created successfully! Your account is pending admin approval. You will be notified once approved."

### Login

- Pending Approval: "Your account is pending approval. Please wait for admin approval before logging in."

### Admin Actions

- Approve: "User approved successfully"
- Reject: "User approval revoked"
- Role Change: "User role updated to [role]"
- Delete: "User deleted successfully"

## Troubleshooting

### Common Issues

1. **Users can't log in after registration**

   - Check if the user has been approved by an admin
   - Verify the `approved` field in the database

2. **Admin can't access admin dashboard**

   - Ensure the user has `role: 'admin'` in the database
   - Check if the user is authenticated

3. **Admin routes return 403**
   - Verify the user's role is 'admin'
   - Check if the authentication token is valid

### Database Queries

Check user approval status:

```javascript
db.users.findOne({ email: "user@example.com" }, { approved: 1, role: 1 });
```

List pending users:

```javascript
db.users.find({ approved: false }, { fullname: 1, email: 1, createdAt: 1 });
```

List all admins:

```javascript
db.users.find({ role: "admin" }, { fullname: 1, email: 1, approved: 1 });
```

## Future Enhancements

Potential improvements to consider:

1. Email notifications when users are approved/rejected
2. Bulk approval/rejection actions
3. User activity tracking
4. Approval history and audit logs
5. Automatic approval for certain email domains
6. Approval workflow with multiple admin levels
