const db = require('../config/db');

class BlogPost {
    static createPost(title, content, country, date_of_visit, user_id, callback) {
        const query = `INSERT INTO blog_posts (title, content, country, date_of_visit, user_id) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [title, content, country, date_of_visit, user_id], function (err) {
            callback(err, this?.lastID);
        });
    }

    static getAllPosts(callback) {
        db.all(`SELECT * FROM blog_posts`, [], callback);
    }

    static findByUser(user_id, callback) {
        db.all(`SELECT * FROM blog_posts WHERE user_id = ?`, [user_id], callback);
    }
}

module.exports = BlogPost;
