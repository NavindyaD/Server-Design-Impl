const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin"); // Import the isAdmin middleware
const User = require("../models/User");

// Route to list all users and their API keys (Admin-only)
router.get("/keys", isAdmin, async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "apiKey", "usageCount", "lastUsedAt"] });
  res.json(users);
});

// Route to delete an API key (Admin-only)
router.delete("/keys/:id", isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.destroy();
  res.json({ message: "API key deleted" });
});

module.exports = router;
