const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const ApiKey = sequelize.define("ApiKey", {
  // Define the fields for the API key
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure that API keys are unique
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Ensure it references the User table
      key: "id", // Foreign key pointing to the User ID
    },
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Track how many times this API key is used
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"), // Track if the API key is active or inactive
    defaultValue: "active",
  },
});

module.exports = ApiKey;
