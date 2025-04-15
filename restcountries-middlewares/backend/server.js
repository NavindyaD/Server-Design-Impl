const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ ADD THIS
const sequelize = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");
const apiRoutes = require("./routes/apikeyRoutes"); 

dotenv.config();

const app = express();

// ✅ Add CORS middleware BEFORE routes
app.use(cors({
  origin: "http://localhost:3000", // your React app origin
  credentials: true
}));

app.use(express.json());

// ✅ Define routes after CORS and express.json
app.use("/auth", authRoutes);
app.use("/api", countryRoutes);
app.use("/api/keys", apiRoutes); 

// ✅ Sync database and start server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
});
