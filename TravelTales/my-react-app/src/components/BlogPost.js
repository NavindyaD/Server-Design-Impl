import React, { useState } from 'react';
import { likePost } from '../services/api';

const BlogPost = ({ post }) => {
  const [liked, setLiked] = useState(post.liked); // Assuming `liked` property exists
  const [likesCount, setLikesCount] = useState(post.likes); // Assuming `likes` property exists

  const handleLike = async () => {
    await likePost(post.id, 1);
    setLiked(true);
    setLikesCount(likesCount + 1);
  };

  const handleDislike = async () => {
    await likePost(post.id, -1);
    setLiked(false);
    setLikesCount(likesCount - 1);
  };

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Country: {post.country}</p>
      <p>Date: {post.date_of_visit}</p>
      <p>Likes: {likesCount}</p>
      {liked ? (
        <button onClick={handleDislike}>Dislike</button>
      ) : (
        <button onClick={handleLike}>Like</button>
      )}
    </div>
  );
};

export default BlogPost;
