const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const BlogPost = require("./models/BlogPost");

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "sec-ch-ua",
      "sec-ch-ua-mobile",
      "sec-ch-ua-platform",
      "User-Agent",
      "Referer",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Blog APIs
app.post("/api/blog", async (req, res) => {
  try {
    const { title, content, author, image } = req.body;
    const post = new BlogPost({ title, content, author, image });
    await post.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("❌ Blog creation failed:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.get("/api/blog", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Blog fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://alrogkas:340kas890@alexro.mo47kja.mongodb.net/citycollege?retryWrites=true&w=majority&appName=alexro"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
