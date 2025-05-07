const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, likeController.addLike);
router.delete('/remove', authenticateToken, likeController.removeLike);
router.get('/post/:blogPostId', likeController.getLikesForPost);

module.exports = router;
