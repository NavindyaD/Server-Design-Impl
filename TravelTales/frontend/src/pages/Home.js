import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data));
  }, []);

  return (
    <div>
      <h1>All Travel Blogs</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
          <p>{post.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
