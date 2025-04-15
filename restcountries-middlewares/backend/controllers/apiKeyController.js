const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// Controller to generate a new API key for the authenticated user
exports.generateApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); //  req.user, populated by the authMiddleware

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const apiKey = uuidv4();

    // Update the user's API key in the database
    await user.update({
      apiKey: apiKey,
      usageCount: 0, // Reset usage count when a new key is generated
      lastUsedAt: null, // Reset last used time
    });

    res.json({
      message: "API key generated successfully",
      apiKey: apiKey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to get the API key of the authenticated user
exports.getApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Get the authenticated user by ID

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's API key and other related information
    res.json({
      apiKey: user.apiKey,
      usageCount: user.usageCount,
      lastUsedAt: user.lastUsedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to update the usage count and the last used time of the API key
exports.updateUsageCount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's usage count and last used time
    await user.update({
      usageCount: user.usageCount + 1, // Increment usage count
      lastUsedAt: new Date(), // Update the last used time
    });

    res.json({
      message: "Usage count updated successfully",
      usageCount: user.usageCount + 1,
      lastUsedAt: user.lastUsedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to delete an API key
exports.deleteApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clear the user's API key
    await user.update({
      apiKey: null, // Delete the API key by setting it to null
      usageCount: 0, // Reset usage count
      lastUsedAt: null, // Clear the last used time
    });

    res.json({
      message: "API key deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
