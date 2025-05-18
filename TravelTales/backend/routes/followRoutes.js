const express = require('express');
const router = express.Router();
const followController = require('../controllers/FollowController');
const authenticate = require('../middleware/authMiddleware');

// Protected routes (require login)
router.post('/follow', authenticate, followController.followUser);
router.delete('/unfollow/:followingId', authenticate, followController.unfollowUser);
router.get('/feed', authenticate, followController.getFeedPosts);

// Public routes (can view anyone’s followers/following)
router.get('/followers/:userId', followController.getFollowers);
router.get('/following/:userId', followController.getFollowing);

module.exports = router;
