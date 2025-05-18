const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Added for CORS
const sequelize = require('./config/database');

// Route imports
const userRoutes = require('./routes/authRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');
const countryRoutes = require('./routes/countryRoutes');
const followRoutes = require('./routes/followRoutes');
//app.use('/api/follows', require('./routes/followRoutes'));

// const likeRoutes = require('./routes/likeRoutes');

const app = express();

// ✅ Enable CORS (Allow frontend at http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Optional: if using cookies or auth headers
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/follow',followRoutes);

// app.use('/api/likes', likeRoutes);

// Database sync and server start
sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('✅ Server is running on http://localhost:5000');
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
});
