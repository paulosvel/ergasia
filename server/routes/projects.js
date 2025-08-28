import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { body, query, validationResult } from "express-validator";
import Project from "../models/Project.js";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/projects"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files
  },
  fileFilter: fileFilter,
});

// Validation rules
const createProjectValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("departments")
    .isArray({ min: 1 })
    .withMessage("At least one department must be selected"),
  body("type")
    .isIn([
      "Recycling",
      "Zero Waste",
      "Seminar",
      "Energy",
      "Water",
      "Transportation",
      "Education",
      "Research",
      "Other",
    ])
    .withMessage("Invalid project type"),
  body("status")
    .optional()
    .isIn([
      "Planning",
      "In Progress",
      "Ongoing",
      "Completed",
      "On Hold",
      "Cancelled",
    ])
    .withMessage("Invalid project status"),
  body("responsiblePerson")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Responsible person name must be between 2 and 100 characters"
    ),
  body("responsibleEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("yearInitiated")
    .isInt({ min: 2000, max: new Date().getFullYear() + 10 })
    .withMessage("Year must be between 2000 and 10 years in the future"),
  body("location")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Location must be between 2 and 200 characters"),
];

// @route   GET /api/projects
// @desc    Get all projects (with filtering and pagination)
// @access  Public
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("type").optional().trim(),
    query("status").optional().trim(),
    query("search").optional().trim(),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "title", "yearInitiated", "status"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  optionalAuth,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 12,
        type,
        status,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build filter
      const filter = {};

      // Only show public projects unless user is authenticated
      if (!req.user || req.user.role !== "admin") {
        filter.isPublic = true;
      }

      if (type) filter.type = type;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute query with pagination
      const projects = await Project.find(filter)
        .populate("createdBy", "fullname email")
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      // Get total count for pagination
      const total = await Project.countDocuments(filter);

      res.json({
        success: true,
        data: projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching projects",
      });
    }
  }
);

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const projects = await Project.find({
      isFeatured: true,
      isPublic: true,
    })
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get featured projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured projects",
    });
  }
});

// @route   GET /api/projects/stats
// @desc    Get project statistics
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          activeProjects: {
            $sum: {
              $cond: [{ $in: ["$status", ["In Progress", "Ongoing"]] }, 1, 0],
            },
          },
          completedProjects: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
          totalCarbonReduction: { $sum: "$metrics.carbonReduction.value" },
          totalEnergySaved: { $sum: "$metrics.energySaved.value" },
          totalWasteReduced: { $sum: "$metrics.wasteReduced.value" },
          totalPeopleImpacted: { $sum: "$metrics.peopleImpacted" },
        },
      },
    ]);

    const projectTypes = await Project.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalCarbonReduction: 0,
          totalEnergySaved: 0,
          totalWasteReduced: 0,
          totalPeopleImpacted: 0,
        },
        projectTypes,
      },
    });
  } catch (error) {
    console.error("Get project stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project statistics",
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };

    // Only show public projects unless user is admin
    if (!req.user || req.user.role !== "admin") {
      filter.isPublic = true;
    }

    const project = await Project.findOne(filter)
      .populate("createdBy", "fullname email avatar")
      .populate("updatedBy", "fullname email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching project",
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.array("images", 5),
  createProjectValidation,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const projectData = { ...req.body };

      // Parse arrays from form data
      if (typeof projectData.departments === "string") {
        projectData.departments = [projectData.departments];
      }
      if (projectData.partners && typeof projectData.partners === "string") {
        projectData.partners = projectData.partners
          .split(",")
          .map((p) => p.trim());
      }
      if (projectData.tags && typeof projectData.tags === "string") {
        projectData.tags = projectData.tags
          .split(",")
          .map((t) => t.trim().toLowerCase());
      }

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        projectData.images = req.files.map((file, index) => ({
          url: `/uploads/projects/${file.filename}`,
          caption: req.body[`imageCaption${index}`] || "",
          isPrimary: index === 0, // First image is primary
        }));
      }

      // Parse metrics if provided
      if (req.body.metrics) {
        try {
          projectData.metrics = JSON.parse(req.body.metrics);
        } catch (e) {
          // Ignore invalid JSON
        }
      }

      // Parse budget if provided
      if (req.body.budget) {
        try {
          projectData.budget = JSON.parse(req.body.budget);
        } catch (e) {
          // Ignore invalid JSON
        }
      }

      // Set creator
      projectData.createdBy = req.user._id;

      const project = new Project(projectData);
      await project.save();

      // Populate the created project
      await project.populate("createdBy", "fullname email");

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error) {
      console.error("Create project error:", error);

      // Clean up uploaded files on error
      if (req.files) {
        // TODO: Implement file cleanup
      }

      res.status(500).json({
        success: false,
        message: "Server error while creating project",
      });
    }
  }
);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.array("images", 5),
  createProjectValidation,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const updateData = { ...req.body };

      // Parse arrays from form data
      if (typeof updateData.departments === "string") {
        updateData.departments = [updateData.departments];
      }
      if (updateData.partners && typeof updateData.partners === "string") {
        updateData.partners = updateData.partners
          .split(",")
          .map((p) => p.trim());
      }
      if (updateData.tags && typeof updateData.tags === "string") {
        updateData.tags = updateData.tags
          .split(",")
          .map((t) => t.trim().toLowerCase());
      }

      // Handle new file uploads
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file, index) => ({
          url: `/uploads/projects/${file.filename}`,
          caption: req.body[`imageCaption${index}`] || "",
          isPrimary: project.images.length === 0 && index === 0,
        }));
        updateData.images = [...(project.images || []), ...newImages];
      }

      // Set updater
      updateData.updatedBy = req.user._id;

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("createdBy updatedBy", "fullname email");

      res.json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      console.error("Update project error:", error);

      if (error.name === "CastError") {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while updating project",
      });
    }
  }
);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    // TODO: Clean up associated files

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting project",
    });
  }
});

export default router;
