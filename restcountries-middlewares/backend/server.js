const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./database/db");
const User = require("./models/User"); // ⬅️ Import User model
const authMiddleware = require("./middleware/authMiddleware"); // ⬅️ Import authMiddleware
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from the views folder
app.use(express.static(path.join(__dirname, "views")));

// API Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/countryRoutes"));
app.use("/admin", authMiddleware, require("./routes/adminRoutes")); // Protect admin routes with authMiddleware
app.use("/user", userRoutes); // This will make the endpoint /user/me available
// TEMPORARY: Make user admin by ID (Remove in production)
app.get("/make-admin/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.isAdmin = true;
      await user.save();
      res.json({ message: "User is now admin", user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Database Sync
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
