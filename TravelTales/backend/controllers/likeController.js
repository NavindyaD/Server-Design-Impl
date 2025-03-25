const BlogPost = require('../models/BlogPost');  // Assuming the correct path is used

// Like a blog post
const likePost = (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the body

    // Check if the user has already liked the post
    BlogPost.hasLiked(postId, userId, (err, row) => {
        if (err) return res.status(500).json({ error: 'Error checking like status' });
        if (row) return res.status(400).json({ error: 'You have already liked this post' });

        // If not liked, proceed to like the post
        BlogPost.likePost(postId, userId, (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to like post' });
            res.status(200).json({ message: 'Post liked successfully' });
        });
    });
};

// Remove like from a blog post
const removeLike = (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    BlogPost.removeLike(postId, userId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to remove like' });
        res.status(200).json({ message: 'Like removed successfully' });
    });
};

module.exports = { likePost, removeLike };
