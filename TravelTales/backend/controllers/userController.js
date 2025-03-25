// models/BlogPost.js
const db = require('../config/db'); // Assuming you're using SQLite or another database connection

// Create a new blog post
const createPost = (userId, title, content, country, dateOfVisit, callback) => {
    const query = `INSERT INTO blog_posts (userId, title, content, country, dateOfVisit)
                   VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [userId, title, content, country, dateOfVisit], function(err) {
        if (err) return callback(err, null);
        callback(null, this.lastID); // Return the ID of the created post
    });
};

// Get all blog posts
const getAllPosts = (callback) => {
    const query = 'SELECT * FROM blog_posts';
    db.all(query, [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows); // Return all blog posts
    });
};

// Get blog posts by country
const getPostsByCountry = (country, callback) => {
    const query = 'SELECT * FROM blog_posts WHERE country = ?';
    db.all(query, [country], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows); // Return posts for the specified country
    });
};

// Get blog posts by user
const getPostsByUser = (username, callback) => {
    const query = 'SELECT * FROM blog_posts WHERE username = ?'; // Assuming 'username' exists in the blog_posts table
    db.all(query, [username], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows); // Return posts for the specified user
    });
};
// controllers/userController.js
const followUser = (req, res) => {
    const { userId, followUserId } = req.body;
    // Logic to follow user
    res.status(200).json({ message: 'User followed successfully' });
};

// Export functions
module.exports = { createPost, getAllPosts, getPostsByCountry, getPostsByUser,followUser };
