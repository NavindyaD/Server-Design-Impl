const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'follows',
  timestamps: false 
});

module.exports = Follow;
