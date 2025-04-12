const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

exports.getApiKey = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "username", "apiKey", "usageCount"]
      });
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve API keys" });
    }
  };
  

exports.createApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.apiKey = uuidv4();
    await user.save();

    res.json({ message: "New API key created", apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ error: "Could not create API key" });
  }
};

exports.updateApiKey = async (req, res) => {
  try {
    const { newApiKey } = req.body;
    if (!newApiKey) return res.status(400).json({ error: "New API key required" });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.apiKey = newApiKey;
    await user.save();

    res.json({ message: "API key updated", apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ error: "Could not update API key" });
  }
};

exports.deleteApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.apiKey = null;
    await user.save();

    res.json({ message: "API key deleted" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete API key" });
  }
};
