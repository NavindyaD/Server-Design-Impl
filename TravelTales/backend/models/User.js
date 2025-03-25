const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = (email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err);
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.run(query, [email, hashedPassword], function(err) {
            callback(err, this.lastID);
        });
    });
};

const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
        callback(err, row);
    });
};

module.exports = { createUser, findUserByEmail };
