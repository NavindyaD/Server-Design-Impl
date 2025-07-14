const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "apiKey", "usageCount", "lastUsedAt"],
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const apiKey = uuidv4();

    await user.update({
      apiKey,
      usageCount: 0,
      lastUsedAt: null,
    });

    res.json({ message: "API key generated", apiKey });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteApiKey = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({
      apiKey: null,
      usageCount: 0,
      lastUsedAt: null,
    });

    res.json({ message: "API key deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUsage = async (req, res) => {
  try {
    const { usageCount, lastUsedAt } = req.body;
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({
      usageCount: usageCount !== undefined ? usageCount : user.usageCount,
      lastUsedAt: lastUsedAt || user.lastUsedAt,
    });

    res.json({ message: "Usage updated" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
