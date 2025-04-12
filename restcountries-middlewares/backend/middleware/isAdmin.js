// middleware/isAuthenticated.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};
