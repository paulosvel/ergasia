const mongoose = require("mongoose");
const User = require("./models/User");

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://alrogkas:340kas890@alexro.mo47kja.mongodb.net/citycollege?retryWrites=true&w=majority&appName=alexro"
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({
        email: "admin@citycollege.edu",
      });

      if (existingAdmin) {
        console.log("❌ Admin user already exists");
        process.exit(0);
      }

      // Create admin user
      const adminUser = new User({
        fullname: "Administrator",
        name: "Administrator",
        email: "admin@citycollege.edu",
        password: "admin123",
        role: "admin",
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully");
      console.log("Email: admin@citycollege.edu");
      console.log("Password: admin123");
      console.log("Role: admin");
    } catch (err) {
      console.error("❌ Error creating admin user:", err);
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
