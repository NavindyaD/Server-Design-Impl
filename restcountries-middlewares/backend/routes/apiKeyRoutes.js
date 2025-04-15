const express = require('express');
const router = express.Router();
const { generateApiKey, getApiKey, updateUsageCount, deleteApiKey } = require('../controllers/apiKeyController');
const isAuthenticated = require('../middleware/authMiddleware');

// Route for generating an API key
router.post('/generate', isAuthenticated, generateApiKey);

// Route for getting the API key details
router.get('/', isAuthenticated, getApiKey);

// Route for updating the usage count of the API key
router.post('/use', isAuthenticated, updateUsageCount);

// Route for deleting the API key
router.delete('/', isAuthenticated, deleteApiKey);

module.exports = router;
