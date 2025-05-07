const { Sequelize } = require('sequelize');

// Set up Sequelize connection (SQLite in this case)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' 
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

module.exports = sequelize;
