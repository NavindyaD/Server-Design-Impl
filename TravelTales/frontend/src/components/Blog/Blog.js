import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogHomePage = () => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState('newest');  // Default sorting option

  useEffect(() => {
    fetchPosts();
  }, [sortOption]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogposts/posts/sort?sortBy=${sortOption}`);

      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <h1>Blog Posts</h1>

      {/* Sort Dropdown */}
      <select value={sortOption} onChange={handleSortChange}>
        <option value="newest">Newest</option>
        <option value="most_liked">Most Liked</option>
        <option value="most_commented">Most Commented</option>
      </select>

      {/* Display Posts */}
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.User.username}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogHomePage;
