const db = require('../config/db');

const followUser = (followerId, followingId, callback) => {
    const query = 'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)';
    db.run(query, [followerId, followingId], function(err) {
        callback(err, this.lastID);
    });
};

const getFollowers = (userId, callback) => {
    const query = 'SELECT * FROM follows WHERE following_id = ?';
    db.all(query, [userId], (err, rows) => {
        callback(err, rows);
    });
};

const getFollowing = (userId, callback) => {
    const query = 'SELECT * FROM follows WHERE follower_id = ?';
    db.all(query, [userId], (err, rows) => {
        callback(err, rows);
    });
};

module.exports = { followUser, getFollowers, getFollowing };
