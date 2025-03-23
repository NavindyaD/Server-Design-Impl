const express = require('express');
const { createPost, getAllPosts } = require('../controllers/blogController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getAllPosts);

module.exports = router;
