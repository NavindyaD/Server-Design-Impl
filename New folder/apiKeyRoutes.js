const express = require('express');
const router = express.Router();
const { generateApiKey, getApiKey, updateUsageCount, deleteApiKey } = require('../controllers/apiKeyController');
const isAuthenticated = require('../middleware/authMiddleware');

// Generate API key
router.post('/generate', isAuthenticated, generateApiKey);

// Get API key details
router.get('/', isAuthenticated, getApiKey);

// Updating the usage count of the API key
router.post('/use', isAuthenticated, updateUsageCount);

// Delete API key
router.delete('/', isAuthenticated, deleteApiKey);

module.exports = router;
