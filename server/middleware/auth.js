import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};
