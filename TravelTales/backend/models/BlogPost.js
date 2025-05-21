const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const BlogPost = sequelize.define('BlogPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  countryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfVisit: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unlikeCount: {  // Add the unlikeCount column
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

BlogPost.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(BlogPost, { foreignKey: 'userId' });

module.exports = BlogPost;

