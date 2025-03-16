const express = require("express");
const cors = require("cors");
const path = require("path"); // Required to serve static files
const sequelize = require("./database/db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from the views folder
app.use(express.static(path.join(__dirname, "views")));

// ✅ API Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/countryRoutes"));

// ✅ Catch-All Route to Serve index.html (For Direct Browser Access)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ✅ Database Sync
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
