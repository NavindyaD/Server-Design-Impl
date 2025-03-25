const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'travelTales.db'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite:' + err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Function to initialize the database schema
const initializeDb = () => {
    const userTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `;
    
    const blogTable = `
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            country TEXT NOT NULL,
            date_of_visit DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;
    
    const followTable = `
        CREATE TABLE IF NOT EXISTS follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER,
            following_id INTEGER,
            FOREIGN KEY (follower_id) REFERENCES users(id),
            FOREIGN KEY (following_id) REFERENCES users(id)
        )
    `;
    
    
    const likeTable = `
        CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)
    `;
    
    db.run(userTable);
    db.run(blogTable);
    db.run(followTable);
    db.run(likeTable)
};

initializeDb();

module.exports = db;
