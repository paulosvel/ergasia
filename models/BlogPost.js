// models/BlogPost.js
const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
