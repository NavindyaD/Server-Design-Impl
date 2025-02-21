const crypto = require("crypto");
const { APIKey } = require("../models/User");

exports.generateApiKey = async (req, res) => {
  const key = crypto.randomBytes(32).toString("hex");
  await APIKey.create({ key, userId: req.user.userId });
  res.json({ apiKey: key });
};
