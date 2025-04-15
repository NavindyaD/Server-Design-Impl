// middleware/isAuthenticated.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request object
    req.user = decoded; 

    // Proceed to the next middleware or route handler
    next(); 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired" });
    }
    console.error("Token verification failed:", error); // Log the error for debugging purposes
    return res.status(401).json({ error: "Token is not valid" });
  }
};
