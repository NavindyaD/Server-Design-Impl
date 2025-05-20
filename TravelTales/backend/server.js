const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/authRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');
const countryRoutes = require('./routes/countryRoutes');
const followRoutes = require('./routes/followRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/follow',followRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});
