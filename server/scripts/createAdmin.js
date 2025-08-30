import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Import User model
import User from "../models/User.js";

// Database connection
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDatabase();

    const adminData = {
      fullname: "Admin User",
      email: "admin@citycollege.edu",
      password: "Admin123!",
      role: "admin",
      approved: true,
      emailVerified: true,
      isActive: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("Role:", adminData.role);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
createAdminUser();
