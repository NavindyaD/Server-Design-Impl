// models/Follow.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Assuming the User model is already created

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  // Ensuring a follower can't follow the same user multiple times
  uniqueKeys: {
    unique_follower_following: {
      fields: ['followerId', 'followingId'],
    },
  },
});

module.exports = Follow;
