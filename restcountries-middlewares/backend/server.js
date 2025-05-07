const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./database/db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const followRoutes = require("./routes/follow");
const countryRoutes = require("./routes/countries");
const likeRoutes = require("./routes/likeRoutes");

dotenv.config();

const app = express();

// Apply CORS before routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/countries", countryRoutes);
app.use("/", likeRoutes); // Optional: adjust prefix if needed

// Sync database and start server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on http://0.0.0.0:5000");
  });
});
