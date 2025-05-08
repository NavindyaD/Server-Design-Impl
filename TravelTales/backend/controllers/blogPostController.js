const BlogPost = require('../models/BlogPost');
const Like = require('../models/Like');
const User = require('../models/User');
const getCountryDetails = require('../utils/getCountryDetails');

exports.createPost = async (req, res) => {
  const { title, content, countryName, dateOfVisit } = req.body;
  const userId = req.user.id; 

  try {
    const post = await BlogPost.create({
      title, content, countryName, dateOfVisit, userId
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.findAll();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await BlogPost.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const { blogPostId } = req.body;

  try {
    const existingLike = await Like.findOne({ where: { userId, blogPostId } });
    if (existingLike) return res.status(400).json({ message: 'Already liked' });

    await Like.create({ userId, blogPostId });

    const post = await BlogPost.findByPk(blogPostId);
    post.likeCount += 1;
    await post.save();

    res.json({ message: 'Post liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  const userId = req.user.id;
  const { blogPostId } = req.body;

  try {
    const existingLike = await Like.findOne({ where: { userId, blogPostId } });
    if (!existingLike) return res.status(400).json({ message: 'Like not found' });

    await existingLike.destroy();

    const post = await BlogPost.findByPk(blogPostId);
    if (post.likeCount > 0) {
      post.likeCount -= 1;
      await post.save();
    }

    res.json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFilterPosts = async (req, res) => {
  try {
    const { country, username, page = 1, limit = 5 } = req.query; // Get query params

    // Pagination
    const offset = (page - 1) * limit;
    
    // Build the where condition dynamically based on the query parameters
    const where = {};
    if (country) {
      where.countryName = country; // Filter by country name
    }
    if (username) {
      where['$User.username$'] = username; // Filter by username of the author (user)
    }

    // Fetch blog posts with filters applied and include User model
    const posts = await BlogPost.findAll({
      where,
      include: {
        model: User,
        attributes: ['username'], // Only include username in the result
      },
      offset,
      limit: parseInt(limit),
    });

    // Enrich posts with country details
    const enrichedPosts = await Promise.all(posts.map(async (post) => {
      const countryDetails = await getCountryDetails(post.countryName);
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.User.username,
        date: post.createdAt,
        country: post.countryName,
        flag: countryDetails.flag,
        currency: countryDetails.currency,
        capital: countryDetails.capital
      };
    }));

    // Return enriched posts
    res.status(200).json(enrichedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};