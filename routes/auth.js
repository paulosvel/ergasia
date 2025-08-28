const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Session storage (in production, use Redis or database)
const sessions = new Map();

// REGISTER route
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      fullname,
      name: fullname, // Set both name and fullname for compatibility
      email,
      password,
    });
    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create session
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    sessions.set(sessionId, {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Set session cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        fullname: user.fullname || user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH STATUS route
router.get("/status", async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const session = sessions.get(sessionId);
    const user = await User.findById(session.userId);

    if (!user) {
      sessions.delete(sessionId);
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        fullname: user.fullname || user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT route
router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId && sessions.has(sessionId)) {
      sessions.delete(sessionId);
    }

    res.clearCookie("sessionId");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
