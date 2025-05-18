// src/components/FeedPosts.js
import React, { useEffect, useState, useContext } from 'react';
import api, { setAuthToken } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const FeedPosts = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);

    api.get('/follow/feed')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, [token]);

  if (!token) return <p>Please login to see your feed.</p>;

  return (
    <div>
      <h2>Your Feed</h2>
      {posts.length === 0 && <p>No posts to show.</p>}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', marginBottom: 10, padding: 10 }}>
          <h4>{post.title}</h4>
          <p>By: {post.User.username}</p>
          <p>{post.content}</p>
          <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;
