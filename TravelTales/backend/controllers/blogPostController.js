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
        attributes: ['id', 'username'], // select fields you want from User
      }],
      order: [['createdAt', 'DESC']], // optional: order posts by creation date
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await BlogPost.findAll();
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

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

    // If filtering by country (with or without username) — return posts with country info once
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

    // If filtering by username only (no country) — include country info per post
    if (username && !country) {
      // Get country details for each post's country (in parallel)
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

    // If no filters (or unknown combination) — just return posts basic info without country details
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

// exports.getFilterPosts = async (req, res) => {
//   try {
//     const { country, username, page = 1, limit = 5 } = req.query;

//     const offset = (page - 1) * limit;
//     const where = {};

//     // Filter conditions
//     if (country) {
//       where.countryName = country;
//     }

//     const include = {
//       model: User,
//       attributes: ['username'],
//     };

//     if (username) {
//       include.where = { username };
//     }

//     const posts = await BlogPost.findAll({
//       where,
//       include,
//       offset,
//       limit: parseInt(limit),
//     });

//     // If country is provided, get details once
//     const countryDetails = country ? await getCountryDetails(country) : null;

//     const formattedPosts = posts.map((post) => ({
//       id: post.id,
//       title: post.title,
//       content: post.content,
//       author: post.User?.username,
//       date: post.createdAt,
//       country: post.countryName,
//       ...(countryDetails && {
//         flag: countryDetails.flag,
//         currency: countryDetails.currency,
//         capital: countryDetails.capital,
//       }),
//     }));

//     res.status(200).json({
//       posts: formattedPosts,
//       ...(countryDetails && {
//         country: {
//           name: country,
//           flag: countryDetails.flag,
//           currency: countryDetails.currency,
//           capital: countryDetails.capital,
//         },
//       }),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getFilterPosts = async (req, res) => {
//   try {
//     const { country, username, page = 1, limit = 5 } = req.query;

//     if (!country) {
//       return res.status(400).json({ error: 'Country is required for this view format.' });
//     }

//     const offset = (page - 1) * limit;

//     const where = { countryName: country };
//     if (username) {
//       where['$User.username$'] = username;
//     }

//     const posts = await BlogPost.findAll({
//       where,
//       include: {
//         model: User,
//         attributes: ['username'],
//       },
//       offset,
//       limit: parseInt(limit),
//     });

//     // Get country metadata once
//     const countryDetails = await getCountryDetails(country);

//     // Format posts
//     const formattedPosts = posts.map((post) => ({
//       id: post.id,
//       title: post.title,
//       content: post.content,
//       author: post.User.username,
//       date: post.createdAt,
//     }));

//     // Send structured response
//     res.status(200).json({
//       country: {
//         name: country,
//         flag: countryDetails.flag,
//         currency: countryDetails.currency,
//         capital: countryDetails.capital,
//       },
//       posts: formattedPosts,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


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


// exports.getFilterPosts = async (req, res) => {
//   try {
//     const { country, username, page = 1, limit = 5 } = req.query; // Get query params

//     // Pagination
//     const offset = (page - 1) * limit;
    
//     // Build the where condition dynamically based on the query parameters
//     const where = {};
//     if (country) {
//       where.countryName = country; // Filter by country name
//     }
//     if (username) {
//       where['$User.username$'] = username; // Filter by username of the author (user)
//     }

//     // Fetch blog posts with filters applied and include User model
//     const posts = await BlogPost.findAll({
//       where,
//       include: {
//         model: User,
//         attributes: ['username'], // Only include username in the result
//       },
//       offset,
//       limit: parseInt(limit),
//     });

//     // Enrich posts with country details
//     const enrichedPosts = await Promise.all(posts.map(async (post) => {
//       const countryDetails = await getCountryDetails(post.countryName);
//       return {
//         id: post.id,
//         title: post.title,
//         content: post.content,
//         author: post.User.username,
//         date: post.createdAt,
//         country: post.countryName,
//         flag: countryDetails.flag,
//         currency: countryDetails.currency,
//         capital: countryDetails.capital
//       };
//     }));

//     // Return enriched posts
//     res.status(200).json(enrichedPosts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };