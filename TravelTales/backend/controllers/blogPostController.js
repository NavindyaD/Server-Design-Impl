const {BlogPost} = require('../models');
const {Like} = require('../models');
const { User } = require('../models');
const getCountryDetails = require('../utils/getCountryDetails');
const {Comment} = require('../models')

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
    const posts = await BlogPost.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username'],
      }],
      order: [['createdAt', 'DESC']], 
    });

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
    const { country, username, page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    // Base query conditions
    const where = {};
    const include = {
      model: User,
      attributes: ['username'],
    };

    // When both country and username provided, filter by both
    if (country) {
      where.countryName = country;
    }
    if (username) {
      include.where = { username };
    }

    const posts = await BlogPost.findAll({
      where,
      include,
      offset,
      limit: parseInt(limit),
    });

    // If filtering by country
    if (country) {
      const countryDetails = await getCountryDetails(country);

      const formattedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.User?.username,
        date: post.createdAt,
        country: post.countryName,
      }));

      return res.status(200).json({
        country: {
          name: country,
          flag: countryDetails.flag,
          currency: countryDetails.currency,
          capital: countryDetails.capital,
        },
        posts: formattedPosts,
      });
    }

    // If filtering by username
    if (username && !country) {
      // Get country details for each post's country
      const postsWithCountryInfo = await Promise.all(
        posts.map(async (post) => {
          const countryDetails = post.countryName ? await getCountryDetails(post.countryName) : null;

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.User?.username,
            date: post.createdAt,
            country: post.countryName,
            flag: countryDetails?.flag || null,
            currency: countryDetails?.currency || null,
            capital: countryDetails?.capital || null,
          };
        })
      );

      return res.status(200).json(postsWithCountryInfo);
    }

    // If no filters 
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.User?.username,
      date: post.createdAt,
      country: post.countryName,
    }));

    return res.status(200).json(formattedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { blogPostId, content } = req.body;
  const userId = req.user.id;

  if (!content) return res.status(400).json({ message: 'Comment content is required' });

  try {
    const post = await BlogPost.findByPk(blogPostId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ blogPostId, userId, content });

    res.status(201).json({
      message: 'Comment added',
      comment: {
        id: comment.id,
        content: comment.content,
        userId,
        blogPostId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsForPost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.findAll({
      where: { blogPostId: postId },
      include: {
        model: User,
        attributes: ['username'],
      },
      order: [['createdAt', 'DESC']],
    });

    const formatted = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: comment.User.username,
      date: comment.createdAt,
    }));

    res.json({ comments: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const posts = await BlogPost.findAll({
      where: { userId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.editPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { title, content, countryName, dateOfVisit } = req.body;

  try {
    const post = await BlogPost.findByPk(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the current user is the post owner
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    // Update post fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.countryName = countryName || post.countryName;
    post.dateOfVisit = dateOfVisit || post.dateOfVisit;

    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id; 

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ message: 'Invalid Post ID provided' });
  }

  try {
    const post = await BlogPost.findByPk(postId, {
      include: [{
        model: User,
        attributes: ['id', 'username'], 
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the post details
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the post.', details: err.message });
  }
};


exports.getSortedPosts = async (req, res) => {
  const { sortBy } = req.query; 

  try {
    let order;

    // Set sorting criteria based on the sortBy query
    switch (sortBy) {
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'most_liked':
        order = [['likeCount', 'DESC']];
        break;
      case 'most_commented':
        order = [
          [Comment, 'createdAt', 'DESC'],
        ];
        break;
      default:
        order = [['createdAt', 'DESC']];
        break;
    }

    // Fetch blog posts based on the sorting criteria
    const posts = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          // Include comments to filter by 'most_commented'
          model: Comment,  
          required: false, 
        },
      ],
      order,
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
