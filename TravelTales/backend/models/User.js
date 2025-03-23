const db = require('../config/db');

class User {
    static createUser(username, email, password, callback) {
        const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(query, [username, email, password], function (err) {
            callback(err, this?.lastID);
        });
    }

    static findByEmail(email, callback) {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
    }
}

module.exports = User;
