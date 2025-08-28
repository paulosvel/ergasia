import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    departments: {
      type: [String],
      required: [true, "At least one department must be specified"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one department must be specified",
      },
    },
    type: {
      type: String,
      required: [true, "Project type is required"],
      enum: {
        values: [
          "Recycling",
          "Zero Waste",
          "Seminar",
          "Energy",
          "Water",
          "Transportation",
          "Education",
          "Research",
          "Other",
        ],
        message: "Invalid project type",
      },
    },
    status: {
      type: String,
      required: [true, "Project status is required"],
      enum: {
        values: [
          "Planning",
          "In Progress",
          "Ongoing",
          "Completed",
          "On Hold",
          "Cancelled",
        ],
        message: "Invalid project status",
      },
      default: "Planning",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    partners: {
      type: [String],
      default: [],
    },
    responsiblePerson: {
      type: String,
      required: [true, "Responsible person is required"],
      trim: true,
      maxlength: [100, "Responsible person name cannot exceed 100 characters"],
    },
    responsibleEmail: {
      type: String,
      required: [true, "Responsible email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    yearInitiated: {
      type: Number,
      required: [true, "Year initiated is required"],
      min: [2000, "Year must be after 2000"],
      max: [
        new Date().getFullYear() + 10,
        "Year cannot be more than 10 years in the future",
      ],
    },
    yearCompleted: {
      type: Number,
      min: [2000, "Year must be after 2000"],
      validate: {
        validator: function (v) {
          return !v || v >= this.yearInitiated;
        },
        message: "Completion year must be after initiation year",
      },
    },
    location: {
      type: String,
      required: [true, "Project location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    budget: {
      amount: {
        type: Number,
        min: [0, "Budget amount cannot be negative"],
      },
      currency: {
        type: String,
        default: "EUR",
        enum: ["EUR", "USD", "GBP"],
      },
    },
    images: [
      {
        url: String,
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    documents: [
      {
        url: String,
        name: String,
        type: String,
        size: Number,
      },
    ],
    metrics: {
      carbonReduction: {
        value: Number,
        unit: {
          type: String,
          enum: ["kg", "tons", "kWh", "liters"],
          default: "kg",
        },
      },
      energySaved: {
        value: Number,
        unit: {
          type: String,
          enum: ["kWh", "MWh", "GWh"],
          default: "kWh",
        },
      },
      wasteReduced: {
        value: Number,
        unit: {
          type: String,
          enum: ["kg", "tons", "liters"],
          default: "kg",
        },
      },
      peopleImpacted: Number,
      costSavings: {
        value: Number,
        currency: {
          type: String,
          default: "EUR",
        },
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
projectSchema.index({ type: 1, status: 1 });
projectSchema.index({ yearInitiated: 1 });
projectSchema.index({ location: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isFeatured: 1, isPublic: 1 });

// Text search index
projectSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  location: "text",
});

// Virtual for project duration
projectSchema.virtual("duration").get(function () {
  if (!this.yearCompleted) return null;
  return this.yearCompleted - this.yearInitiated;
});

// Virtual for primary image
projectSchema.virtual("primaryImage").get(function () {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find((img) => img.isPrimary) || this.images[0];
});

// Pre-save middleware to ensure only one primary image
projectSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        img.isPrimary = index === this.images.findIndex((i) => i.isPrimary);
      });
    }
  }
  next();
});

// Static method for advanced search
projectSchema.statics.searchProjects = function (query, options = {}) {
  const {
    type,
    status,
    location,
    yearInitiated,
    tags,
    isPublic = true,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const filter = { isPublic };

  if (query) {
    filter.$text = { $search: query };
  }

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (location) filter.location = new RegExp(location, "i");
  if (yearInitiated) filter.yearInitiated = yearInitiated;
  if (tags && tags.length > 0) filter.tags = { $in: tags };

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  return this.find(filter)
    .populate("createdBy", "fullname email")
    .populate("updatedBy", "fullname email")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

export default mongoose.model("Project", projectSchema);
