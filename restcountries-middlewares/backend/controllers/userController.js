// controllers/userController.js

const User = require("../models/User");

exports.getUserInfo = async (req, res) => {
  try {
    // Log req.user to ensure it is populated correctly
    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized. No user info found." });
    }

    // Get the user from the database by their ID
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user info, including the isAdmin status
    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,  // Ensure this is included
      apiKey: user.apiKey,
      usageCount: user.usageCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
