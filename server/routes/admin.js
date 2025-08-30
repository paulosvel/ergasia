import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    // Filter by approval status
    if (status === "pending") {
      query.approved = false;
    } else if (status === "approved") {
      query.approved = true;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// @route   PUT /api/admin/users/:userId/approve
// @desc    Approve a user (admin only)
// @access  Private/Admin
router.put(
  "/users/:userId/approve",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.approved) {
        return res.status(400).json({
          success: false,
          message: "User is already approved",
        });
      }

      user.approved = true;
      await user.save();

      res.json({
        success: true,
        message: "User approved successfully",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          approved: user.approved,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Approve user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while approving user",
      });
    }
  }
);

// @route   PUT /api/admin/users/:userId/reject
// @desc    Reject a user (admin only)
// @access  Private/Admin
router.put(
  "/users/:userId/reject",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.approved) {
        return res.status(400).json({
          success: false,
          message: "User is already not approved",
        });
      }

      user.approved = false;
      await user.save();

      res.json({
        success: true,
        message: "User approval revoked successfully",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          approved: user.approved,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Reject user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while rejecting user",
      });
    }
  }
);

// @route   PUT /api/admin/users/:userId/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put(
  "/users/:userId/role",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be 'user' or 'admin'",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent admin from changing their own role
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot change your own role",
        });
      }

      user.role = role;
      await user.save();

      res.json({
        success: true,
        message: "User role updated successfully",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          approved: user.approved,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating user role",
      });
    }
  }
);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete(
  "/users/:userId",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting user",
      });
    }
  }
);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ approved: false });
    const approvedUsers = await User.countDocuments({ approved: true });
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        adminUsers,
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin stats",
    });
  }
});

export default router;
