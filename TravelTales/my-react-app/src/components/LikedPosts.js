import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api'; // Reusing the getPosts function
import BlogPost from './BlogPost'; // Reusing the BlogPost component

const LikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        // Replace with the appropriate endpoint for fetching liked posts
        const response = await getPosts('', '', true); // Assuming we filter liked posts
        setLikedPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching liked posts:', err);
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  if (loading) return <p>Loading liked posts...</p>;

  return (
    <div>
      <h2>Your Liked Posts</h2>
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => <BlogPost key={post.id} post={post} />)
      ) : (
        <p>You haven't liked any posts yet.</p>
      )}
    </div>
  );
};

export default LikedPosts;
