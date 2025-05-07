// controllers/likeController.js
const Like = require('../models/Like');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User'); 

// Add a like to a blog post
exports.addLike = async (req, res) => {
  try {
    const { blogPostId } = req.body;
    const userId = req.user.id; 

    // Check if the like already exists for the user and blog post
    const existingLike = await Like.findOne({ where: { userId, blogPostId } });
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    // Create a new like
    const like = await Like.create({ userId, blogPostId });

    // Increment the like count in the blog post model
    const blogPost = await BlogPost.findByPk(blogPostId);
    blogPost.likeCount += 1;
    await blogPost.save();

    res.status(201).json({ message: 'Like added', like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the like' });
  }
};

// Remove a like from a blog post
exports.removeLike = async (req, res) => {
  try {
    const { blogPostId } = req.body;
    const userId = req.user.id; 

    // Find the like and delete it
    const like = await Like.findOne({ where: { userId, blogPostId } });
    if (!like) {
      return res.status(400).json({ message: 'Like not found' });
    }

    await like.destroy();

    // Decrement the like count in the blog post model
    const blogPost = await BlogPost.findByPk(blogPostId);
    blogPost.likeCount -= 1;
    await blogPost.save();

    res.status(200).json({ message: 'Like removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while removing the like' });
  }
};

exports.getLikesForPost = async (req, res) => {
  try {
    const { blogPostId } = req.params;
    
    const likes = await Like.findAll({
      where: { blogPostId },
      include: {
        model: User,
        attributes: ['id', 'email'] 
      }
    });

    if (!likes) {
      return res.status(404).json({ message: 'No likes found for this post' });
    }

    res.status(200).json({ message: 'Likes retrieved successfully', likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving likes' });
  }
};
