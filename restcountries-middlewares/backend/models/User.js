const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  apiKey: { type: DataTypes.STRING, unique: true },
  usageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastUsedAt: { type: DataTypes.DATE, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
});

module.exports = User;
