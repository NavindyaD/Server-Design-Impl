const jwt = require("jsonwebtoken");
const { APIKey } = require("../models/User");

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

exports.authenticateAPIKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || !(await APIKey.findOne({ where: { key: apiKey } }))) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};
