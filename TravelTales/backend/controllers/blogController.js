const BlogPost = require('../models/BlogPost');

const createBlogPost = (req, res) => {
    const { userId, title, content, country, dateOfVisit } = req.body;
    BlogPost.createPost(userId, title, content, country, dateOfVisit, (err, postId) => {
        if (err) return res.status(500).json({ error: 'Failed to create blog post' });
        res.status(201).json({ message: 'Blog post created', postId });
    });
};

const getBlogPosts = (req, res) => {
    BlogPost.getAllPosts((err, posts) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve blog posts' });
        res.status(200).json(posts);
    });
};

const getBlogPostsByCountry = (req, res) => {
    const { country } = req.params;
    BlogPost.getPostsByCountry(country, (err, posts) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve posts by country' });
        res.status(200).json(posts);
    });
};

const getBlogPostsByUser = (req, res) => {
    const { username } = req.params;
    BlogPost.getPostsByUser(username, (err, posts) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve posts by user' });
        res.status(200).json(posts);
    });
};

module.exports = { createBlogPost, getBlogPosts, getBlogPostsByCountry, getBlogPostsByUser };
