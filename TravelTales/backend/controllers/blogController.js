const BlogPost = require('../models/BlogPost');

exports.createPost = (req, res) => {
    const { title, content, country, date_of_visit } = req.body;
    const user_id = req.user.id;

    BlogPost.createPost(title, content, country, date_of_visit, user_id, (err, postId) => {
        if (err) return res.status(500).json({ error: 'Error creating post' });
        res.json({ message: 'Post created successfully', postId });
    });
};

exports.getAllPosts = (req, res) => {
    BlogPost.getAllPosts((err, posts) => {
        if (err) return res.status(500).json({ error: 'Error retrieving posts' });
        res.json(posts);
    });
};
