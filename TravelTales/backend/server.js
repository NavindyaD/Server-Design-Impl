const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');
const countryRoutes = require('./routes/countryRoutes');
const sequelize = require('./config/database');
const likeRoutes = require('./routes/likeRoutes');
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/likes', likeRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});

