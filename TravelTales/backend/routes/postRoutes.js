const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new post
router.post('/', authMiddleware, postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Edit a post
router.put('/:id', authMiddleware, postController.editPost);

// Delete a post
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
