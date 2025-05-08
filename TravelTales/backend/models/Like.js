const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const BlogPost = require('./BlogPost');

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
  blogPostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BlogPosts',
      key: 'id',
    }
  },
}, {
  timestamps: true,
});

Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(BlogPost, { foreignKey: 'blogPostId', onDelete: 'CASCADE' });

module.exports = Like;
