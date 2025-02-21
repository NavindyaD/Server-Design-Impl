const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKeyController");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.post("/generate", authenticateJWT, apiKeyController.generateApiKey);

module.exports = router;
