const User = require('./User');
const BlogPost = require('./BlogPost');
const Like = require('./Like');

// User & BlogPost
User.hasMany(BlogPost, { foreignKey: 'userId' });
BlogPost.belongsTo(User, { foreignKey: 'userId' });

// BlogPost & Like
BlogPost.hasMany(Like, { foreignKey: 'blogPostId' });
Like.belongsTo(BlogPost, { foreignKey: 'blogPostId' });

// User & Like
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  BlogPost,
  Like,
};
