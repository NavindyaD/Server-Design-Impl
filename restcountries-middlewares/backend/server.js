const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");
const adminApiKeysRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'http://localhost' : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  },
}));

app.use("/auth", authRoutes);
app.use("/api", countryRoutes);
app.use("/api/admin/apikeys", adminApiKeysRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(3001, "0.0.0.0", () =>
    console.log("Server running at http://0.0.0.0:3001")
  );
});
