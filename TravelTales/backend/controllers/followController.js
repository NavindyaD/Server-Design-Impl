const { Follow, User, BlogPost } = require('../models');

exports.followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const existing = await Follow.findOne({ where: { followerId, followingId } });
    if (existing) {
      return res.status(400).json({ message: 'Already following this user.' });
    }

    await Follow.create({ followerId, followingId });
    res.json({ message: 'Followed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error following user' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.id;

    await Follow.destroy({ where: { followerId, followingId } });
    res.json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [{ model: User, as: 'Follower', attributes: ['id', 'username'] }],
    });

    res.json(followers.map(f => f.Follower));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving followers' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [{ model: User, as: 'Following', attributes: ['id', 'username'] }],
    });

    res.json(following.map(f => f.Following));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving following' });
  }
};

exports.getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await Follow.findAll({ where: { followerId: userId } });
    const followingIds = following.map(f => f.followingId);

    const posts = await BlogPost.findAll({
      where: { userId: followingIds },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
};
