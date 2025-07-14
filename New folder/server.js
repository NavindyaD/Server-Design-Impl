const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");
const apiRoutes = require("./routes/apikeyRoutes");
const adminApiKeysRoutes = require("./routes/adminApiKeys"); // <-- admin API keys routes

dotenv.config();

const app = express();

// Add CORS middleware BEFORE routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Public / user routes
app.use("/auth", authRoutes);
app.use("/api", countryRoutes);
app.use("/api/keys", apiRoutes);

// Admin-only API key management routes
app.use("/api/admin/apikeys", adminApiKeysRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(5000, "0.0.0.0", () =>
    console.log("Server running on http://0.0.0.0:5000")
  );
});
