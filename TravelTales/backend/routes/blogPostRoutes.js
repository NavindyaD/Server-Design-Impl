const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, blogPostController.createPost);
router.get('/posts', blogPostController.getAllPosts);
router.delete('/:id', authenticateToken, blogPostController.deletePost);
router.post('/like', authenticateToken, blogPostController.likePost);

module.exports = router;
