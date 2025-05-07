const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];  

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Token expired'
        : 'Invalid or expired token';

      return res.status(401).json({ message });
    }

    req.user = decoded;  
    next();
  });
};

module.exports = authenticateToken;
