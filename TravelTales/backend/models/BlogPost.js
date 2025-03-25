const db = require('../config/db');

const createPost = (userId, title, content, country, dateOfVisit, callback) => {
    const query = 'INSERT INTO blog_posts (user_id, title, content, country, date_of_visit) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [userId, title, content, country, dateOfVisit], function(err) {
        callback(err, this.lastID);
    });
};

const getAllPosts = (callback) => {
    const query = 'SELECT * FROM blog_posts';
    db.all(query, [], (err, rows) => {
        callback(err, rows);
    });
};

const getPostsByCountry = (country, callback) => {
    const query = 'SELECT * FROM blog_posts WHERE country LIKE ?';
    db.all(query, ['%' + country + '%'], (err, rows) => {
        callback(err, rows);
    });
};

const getPostsByUser = (username, callback) => {
    const query = 'SELECT * FROM blog_posts INNER JOIN users ON blog_posts.user_id = users.id WHERE users.email LIKE ?';
    db.all(query, ['%' + username + '%'], (err, rows) => {
        callback(err, rows);
    });
};












// Like a blog post
const likePost = (postId, userId, callback) => {
    const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';

    // Insert a new like into the likes table
    db.run(query, [postId, userId], function(err) {
        if (err) return callback(err, null);
        callback(null, this.lastID); // Return the ID of the inserted row
    });
};

// Remove like from a blog post
const removeLike = (postId, userId, callback) => {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';

    // Delete the like from the likes table
    db.run(query, [postId, userId], function(err) {
        if (err) return callback(err, null);
        callback(null, { message: 'Like removed successfully' });
    });
};

// Count the number of likes on a post
const getLikesCount = (postId, callback) => {
    const query = 'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?';

    // Get the count of likes for a specific post
    db.get(query, [postId], (err, row) => {
        if (err) return callback(err, null);
        callback(null, row.likeCount); // Return the count of likes
    });
};

// Check if the user has liked a post
const hasLiked = (postId, userId, callback) => {
    const query = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';

    // Check if the user has already liked the post
    db.get(query, [postId, userId], (err, row) => {
        if (err) return callback(err, null);
        callback(null, row); // Return the row if the user has liked the post, else null
    });
};


module.exports = { createPost, getAllPosts, getPostsByCountry, getPostsByUser,likePost, removeLike, getLikesCount, hasLiked  };
