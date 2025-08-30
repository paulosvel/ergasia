import express from "express";
import { body, query, validationResult } from "express-validator";
import BlogPost from "../models/BlogPost.js";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const createPostValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters long"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

// @route   GET /api/blog
// @desc    Get all blog posts (with filtering and pagination)
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
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("category").optional().trim(),
    query("tag").optional().trim(),
    query("search").optional().trim(),
    query("author").optional().trim(),
    query("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be boolean"),
  ],
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
        limit = 10,
        category,
        tag,
        search,
        author,
        featured,
      } = req.query;

      // Build filter
      const filter = {
        status: "published",
        isPublic: true,
      };

      if (category) filter.categories = category;
      if (tag) filter.tags = tag;
      if (author) filter.author = author;
      if (featured !== undefined) filter.isFeatured = featured === "true";

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      // Execute query with pagination
      const posts = await BlogPost.find(filter)
        .populate("author", "fullname email avatar")
        .sort({ publishedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-comments") // Exclude comments for list view
        .lean();

      // Get total count for pagination
      const total = await BlogPost.countDocuments(filter);

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching blog posts",
      });
    }
  }
);

// @route   GET /api/blog/featured
// @desc    Get featured blog posts
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const posts = await BlogPost.find({
      status: "published",
      isPublic: true,
      isFeatured: true,
    })
      .populate("author", "fullname email avatar")
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-comments")
      .lean();

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured posts",
    });
  }
});

// @route   GET /api/blog/categories
// @desc    Get all categories with post counts
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: "published", isPublic: true } },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
});

// @route   GET /api/blog/tags
// @desc    Get all tags with post counts
// @access  Public
router.get("/tags", async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $match: { status: "published", isPublic: true } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tags",
    });
  }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get("/:slug", optionalAuth, async (req, res) => {
  try {
    const filter = {
      slug: req.params.slug,
      status: "published",
      isPublic: true,
    };

    const post = await BlogPost.findOne(filter)
      .populate("author", "fullname email avatar")
      .populate("comments.author", "fullname avatar")
      .populate("relatedPosts", "title slug excerpt featuredImage publishedAt");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment view count
    await post.addView();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get blog post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching blog post",
    });
  }
});

// @route   POST /api/blog
// @desc    Create new blog post
// @access  Private (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createPostValidation,
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

      const postData = {
        ...req.body,
        author: req.user._id,
      };

      const post = new BlogPost(postData);
      await post.save();

      // Populate the created post
      await post.populate("author", "fullname email avatar");

      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: post,
      });
    } catch (error) {
      console.error("Create blog post error:", error);

      // Handle specific validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      // Handle duplicate key errors (e.g., duplicate slug)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "A blog post with this title already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || "Server error while creating blog post",
      });
    }
  }
);

// @route   PUT /api/blog/:id
// @desc    Update blog post
// @access  Private (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  createPostValidation,
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

      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      const updatedPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("author", "fullname email avatar");

      res.json({
        success: true,
        message: "Blog post updated successfully",
        data: updatedPost,
      });
    } catch (error) {
      console.error("Update blog post error:", error);

      if (error.name === "CastError") {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while updating blog post",
      });
    }
  }
);

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog post error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting blog post",
    });
  }
});

// @route   POST /api/blog/:id/like
// @desc    Toggle like on blog post
// @access  Private
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await post.toggleLike(req.user._id);

    res.json({
      success: true,
      message: "Like toggled successfully",
      data: {
        likes: post.likes.length,
        isLiked: post.likes.includes(req.user._id),
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling like",
    });
  }
});

// @route   POST /api/blog/:id/comments
// @desc    Add comment to blog post
// @access  Private
router.post(
  "/:id/comments",
  authenticateToken,
  [
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Comment must be between 1 and 1000 characters"),
  ],
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

      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      const comment = {
        author: req.user._id,
        content: req.body.content,
        isApproved: true, // Auto-approve for now
      };

      post.comments.push(comment);
      await post.save();

      // Populate the new comment
      await post.populate("comments.author", "fullname avatar");

      const newComment = post.comments[post.comments.length - 1];

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: newComment,
      });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding comment",
      });
    }
  }
);

export default router;
