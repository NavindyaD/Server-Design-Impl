const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const BlogPost = require('./BlogPost');

const Unlike = sequelize.define('Unlike', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  blogPostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true, // To track when the unlike occurred
});

Unlike.belongsTo(User, { foreignKey: 'userId' });
Unlike.belongsTo(BlogPost, { foreignKey: 'blogPostId' });
User.hasMany(Unlike, { foreignKey: 'userId' });
BlogPost.hasMany(Unlike, { foreignKey: 'blogPostId' });

module.exports = Unlike;
