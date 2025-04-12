const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKeyController");
const authMiddleware = require("../middleware/authMiddleware");

// Get current API key
router.get("/", authMiddleware, apiKeyController.getApiKey);

// Generate new API key (random UUID)
router.post("/", authMiddleware, apiKeyController.createApiKey);

// Update API key manually
router.put("/", authMiddleware, apiKeyController.updateApiKey);

// Delete API key
router.delete("/", authMiddleware, apiKeyController.deleteApiKey);

module.exports = router;
