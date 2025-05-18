const User = require('./User');
const BlogPost = require('./BlogPost');
const Like = require('./Like');
const Comment = require('./Comment');
const Follow = require('./Follow');
// User & BlogPost
User.hasMany(BlogPost, { foreignKey: 'userId', onDelete: 'CASCADE' });
BlogPost.belongsTo(User, { foreignKey: 'userId' });

// BlogPost & Like
BlogPost.hasMany(Like, { foreignKey: 'blogPostId', onDelete: 'CASCADE' });
Like.belongsTo(BlogPost, { foreignKey: 'blogPostId' });

// User & Like
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

// BlogPost & Comment
BlogPost.hasMany(Comment, { foreignKey: 'blogPostId', onDelete: 'CASCADE' });
Comment.belongsTo(BlogPost, { foreignKey: 'blogPostId' });

// User & Comment
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// models/Follow.js
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'Follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });
User.hasMany(Follow, { foreignKey: 'followerId', as: 'Followings' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'Followers' });


module.exports = {
  User,
  BlogPost,
  Like,
  Comment,
  Follow,
};
