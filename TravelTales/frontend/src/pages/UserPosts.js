import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './UserPosts.css';

const UserPosts = () => {
  const { userId } = useParams();
  const { user } = useAuthContext();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Debugging: Show user info in console
  useEffect(() => {
    if (user) {
      console.log('Logged-in username:', user.username);
      console.log('Token:', user.token);
    } else {
      console.log('No user found in context');
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId || !user?.token) {
        setError('User ID or token missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/blogposts/user/${userId}/posts`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, user]);

  if (!userId) return <p className="error">User ID is required to load posts.</p>;
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-posts">
      <h2>User {userId}'s Blog Posts</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No posts found for this user.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p><em>by {post.User?.username || 'Unknown'}</em></p>
              <p>{post.content}</p>
              <small>{new Date(post.createdAt).toLocaleString()}</small>

              {/* Edit button - Link to EditPost page */}
              <Link to={`/edit/${post.id}`}>
                <button>Edit</button>
              </Link>

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;
