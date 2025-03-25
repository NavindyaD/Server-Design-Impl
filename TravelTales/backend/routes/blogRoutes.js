const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const likeController = require('../controllers/likeController'); 

router.post('/create', blogController.createBlogPost);
router.get('/', blogController.getBlogPosts);
router.get('/country/:country', blogController.getBlogPostsByCountry);
router.get('/user/:username', blogController.getBlogPostsByUser);

// Route for liking a blog post
router.post('/like/:postId', likeController.likePost);

// Route for removing a like from a blog post
router.delete('/like/:postId', likeController.removeLike);

module.exports = router;
