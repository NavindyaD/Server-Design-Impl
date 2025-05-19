const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, blogPostController.createPost);
router.get('/posts', blogPostController.getAllPosts);
router.delete('/:id', authenticateToken, blogPostController.deletePost);
router.post('/like', authenticateToken, blogPostController.likePost);
router.post('/unlike', authenticateToken, blogPostController.unlikePost);
router.get('/filter-posts', blogPostController.getFilterPosts);
router.post('/comment', authenticateToken, blogPostController.addComment);
router.get('/:postId/comments', blogPostController.getCommentsForPost);
router.put('/posts/:id', authenticateToken, blogPostController.editPost)
router.get('/postsById/:id', authenticateToken, blogPostController.getPostById)
router.get('/user/:userId/posts', authenticateToken, blogPostController.getPostsByUserId);
router.get('/posts/sort', blogPostController.getSortedPosts);  // New endpoint for sorting posts


module.exports = router;
