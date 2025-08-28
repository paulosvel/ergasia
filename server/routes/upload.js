import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/general";

    // Determine upload path based on file type or category
    if (file.fieldname === "avatar") {
      uploadPath = "uploads/avatars";
    } else if (file.fieldname === "project-images") {
      uploadPath = "uploads/projects";
    } else if (file.fieldname === "blog-images") {
      uploadPath = "uploads/blog";
    }

    cb(null, path.join(__dirname, "../../", uploadPath));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const allowedDocTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and documents are allowed."),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10, // Maximum 10 files
  },
  fileFilter: fileFilter,
});

// @route   POST /api/upload/single
// @desc    Upload single file
// @access  Private
router.post("/single", authenticateToken, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Determine the public URL based on the upload path
    let publicUrl = req.file.path.replace(/\\/g, "/"); // Convert Windows paths
    publicUrl = publicUrl.replace(/.*uploads/, "/uploads"); // Make relative to public folder

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: publicUrl,
      },
    });
  } catch (error) {
    console.error("Single file upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during file upload",
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post(
  "/multiple",
  authenticateToken,
  upload.array("files", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => {
        let publicUrl = file.path.replace(/\\/g, "/"); // Convert Windows paths
        publicUrl = publicUrl.replace(/.*uploads/, "/uploads"); // Make relative to public folder

        return {
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: publicUrl,
        };
      });

      res.json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Multiple file upload error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during file upload",
      });
    }
  }
);

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No avatar file uploaded",
        });
      }

      // Check if file is an image
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Avatar must be an image file",
        });
      }

      let publicUrl = req.file.path.replace(/\\/g, "/"); // Convert Windows paths
      publicUrl = publicUrl.replace(/.*uploads/, "/uploads"); // Make relative to public folder

      // Update user's avatar in database
      const User = (await import("../models/User.js")).default;
      await User.findByIdAndUpdate(req.user._id, { avatar: publicUrl });

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          filename: req.file.filename,
          url: publicUrl,
        },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during avatar upload",
      });
    }
  }
);

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete("/:filename", authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;

    // Basic security check - ensure filename doesn't contain path traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename",
      });
    }

    // For now, just return success
    // TODO: Implement actual file deletion with proper permissions check
    res.json({
      success: true,
      message: "File deletion requested",
    });
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during file deletion",
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 10 files.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field.",
      });
    }
  }

  if (
    error.message ===
    "Invalid file type. Only images and documents are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "File upload error",
  });
});

export default router;
