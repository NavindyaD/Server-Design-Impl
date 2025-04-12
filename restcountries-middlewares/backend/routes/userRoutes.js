// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const { getUserInfo } = require("../controllers/userController");
const isAuthenticated = require("../middleware/isAdmin"); // Assuming you have a middleware to verify JWT

// Define the route to get user info
router.get("/me", isAuthenticated, getUserInfo); // Ensure the user is authenticated first

module.exports = router;
