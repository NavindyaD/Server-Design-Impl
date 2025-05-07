const BlogPost = require('../models/BlogPost');
const Like = require('../models/Like');

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
