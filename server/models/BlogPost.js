import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, "Reply cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog post title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog post content is required"],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    featuredImage: {
      url: String,
      caption: String,
      alt: String,
    },
    images: [
      {
        url: String,
        caption: String,
        alt: String,
      },
    ],
    categories: [
      {
        type: String,
        trim: true,
        lowercase: true,
        enum: [
          "sustainability",
          "energy",
          "environment",
          "education",
          "research",
          "news",
          "events",
          "projects",
        ],
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number, // in minutes
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    seo: {
      metaTitle: String,
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [String],
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ categories: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ isFeatured: 1, isPublic: 1 });

// Text search index
blogPostSchema.index({
  title: "text",
  content: "text",
  excerpt: "text",
  tags: "text",
});

// Virtual for comment count
blogPostSchema.virtual("commentCount").get(function () {
  return this.comments
    ? this.comments.filter((comment) => comment.isApproved).length
    : 0;
});

// Virtual for like count
blogPostSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for URL
blogPostSchema.virtual("url").get(function () {
  return `/blog/${this.slug}`;
});

// Pre-save middleware to generate slug
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Generate excerpt if not provided
  if (this.isModified("content") && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt =
      plainText.substring(0, 300) + (plainText.length > 300 ? "..." : "");
  }

  // Set publishedAt when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

// Static method for advanced search
blogPostSchema.statics.searchPosts = function (query, options = {}) {
  const {
    category,
    tags,
    author,
    status = "published",
    isPublic = true,
    page = 1,
    limit = 10,
    sortBy = "publishedAt",
    sortOrder = "desc",
  } = options;

  const filter = { status, isPublic };

  if (query) {
    filter.$text = { $search: query };
  }

  if (category) filter.categories = category;
  if (tags && tags.length > 0) filter.tags = { $in: tags };
  if (author) filter.author = author;

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  return this.find(filter)
    .populate("author", "fullname email avatar")
    .populate("comments.author", "fullname avatar")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Instance method to add view
blogPostSchema.methods.addView = function () {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like
blogPostSchema.methods.toggleLike = function (userId) {
  const hasLiked = this.likes.includes(userId);

  if (hasLiked) {
    this.likes.pull(userId);
  } else {
    this.likes.push(userId);
  }

  return this.save();
};

export default mongoose.model("BlogPost", blogPostSchema);
