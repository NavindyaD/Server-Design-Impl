const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

const APIKey = sequelize.define("APIKey", {
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Establish relationships
User.hasMany(APIKey, { foreignKey: "userId", onDelete: "CASCADE" });
APIKey.belongsTo(User, { foreignKey: "userId" });

// Sync database
sequelize.sync({ alter: true }) 
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Database sync error:", err));

module.exports = { User, APIKey };
