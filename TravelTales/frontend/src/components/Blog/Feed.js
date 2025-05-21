import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    if (!user?.token) {
      setError('User not authenticated');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchFeedPosts = async (sort = sortOption) => {
      try {
        const res = await axios.get('http://localhost:5000/api/follow/feed', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            sortBy: sort,
          },
        });

        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Failed to load feed');
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, [user, navigate, sortOption]);

  if (loading) {
    return <p>Loading feed...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="feed-container">
      <h1>Feed</h1>
      
      {posts.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-meta">
                <p>
                  <strong>Author:</strong>{' '}
                  {post.User?.username ? (
                    <Link to={`/profile/${post.User.id}`}>{post.User.username}</Link>
                  ) : (
                    'Unknown'
                  )}
                </p>
                <p><strong>Country:</strong> {post.countryName || post.country}</p>
                {post.flag && (
                  <img src={post.flag} alt={`${post.countryName || post.country} flag`} />
                )}
                <p><strong>Date:</strong> {new Date(post.dateOfVisit || post.createdAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feed;
