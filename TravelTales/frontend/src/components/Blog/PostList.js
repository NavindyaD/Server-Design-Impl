import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import CommentSection from '../CommentSection';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const PostList = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);
  const [country, setCountry] = useState('');
  const [username, setUsername] = useState('');
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    fetchAllPosts();
    if (user) fetchFollowingList(user.id);
  }, [user]);

  const fetchAllPosts = async () => {
    try {
      const response = await api.get('/blogposts/posts');
      setPosts(response.data);
      setCountryDetails(null);
    } catch (error) {
      alert('Failed to fetch posts');
    }
  };

  const fetchFilteredPosts = async () => {
    if (!country.trim() && !username.trim()) {
      alert('Please enter a country or username to filter.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('page', 1);
      params.append('limit', 5);
      if (country.trim()) params.append('country', country.trim());
      if (username.trim()) params.append('username', username.trim());

      const response = await api.get(`/blogposts/filter-posts?${params.toString()}`);

      if (country.trim()) {
        const { posts, country: countryInfo } = response.data;
        setPosts(posts || []);
        setCountryDetails(countryInfo || null);
      } else {
        setPosts(response.data);
        setCountryDetails(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to filter posts');
    }
  };

  const refreshPosts = () => {
    if (country.trim() || username.trim()) {
      fetchFilteredPosts();
    } else {
      fetchAllPosts();
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post('/blogposts/like', { blogPostId: postId });
      refreshPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await api.post('/blogposts/unlike', { blogPostId: postId });
      refreshPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unlike post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/blogposts/${postId}`);
      refreshPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  // Fetch the list of users that the logged-in user is following
  const fetchFollowingList = async (userId) => {
    try {
      const response = await api.get(`/follow/following/${userId}`);
      setFollowingList(response.data.map(u => u.id)); // store array of followed user IDs
    } catch (error) {
      console.error('Failed to fetch following list', error);
    }
  };

  // Follow a user
  const handleFollow = async (followingId) => {
  try {
    const token = localStorage.getItem('token');  // or from your auth context
    if (!token) {
      alert('You must be logged in to follow users');
      return;
    }

    await api.post('/follow/follow', 
      { followingId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert('Followed successfully');
    refreshPosts(); 
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to follow user');
  }
};

const handleUnfollow = async (followedUserId) => {
    if (!user) {
      alert('Please login to unfollow users.');
      return;
    }
    try {
      await api.post('/follow/unfollow', { followerId: user.id, followedId: followedUserId });
      fetchFollowingList(user.id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  return (
    <div>
      <h2>Blog Posts</h2>

      {/* Filter inputs */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by username (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={fetchFilteredPosts}>Filter</button>
        <button
          onClick={() => {
            setCountry('');
            setUsername('');
            fetchAllPosts();
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Show country details if available */}
      {countryDetails && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Country Info: {countryDetails.name}</h3>
          <img src={countryDetails.flag} alt={`${countryDetails.name} flag`} width={100} />
          <p>Capital: {countryDetails.capital}</p>
          <p>Currency: {countryDetails.currency}</p>
        </div>
      )}

      {/* List of posts */}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => {
          const isFollowing = followingList.includes(post.userId);
          const isOwnPost = user && user.id === post.userId;
          return (
            <div
              key={post.id}
              style={{ border: '1px solid gray', marginBottom: '15px', padding: '10px' }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <strong>Author:</strong>{' '}
                {post.User?.username ? (
                  <Link to={`/profile/${post.User.id}`}>{post.User.username}</Link>
                ) : (
                  'Unknown'
                )}
              </p>
              <p>
                <strong>Country:</strong> {post.countryName || post.country}
              </p>
              {post.flag && (
                <img
                  src={post.flag}
                  alt={`${post.countryName || post.country} flag`}
                  style={{ width: '50px', height: 'auto', marginLeft: '10px' }}
                />
              )}
              <p>
                <strong>Date:</strong>{' '}
                {new Date(post.dateOfVisit || post.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Likes:</strong> {post.likeCount ?? 0}
              </p>

              {/* Like, Unlike, Delete Buttons */}
              <button onClick={() => handleLike(post.id)}>Like</button>
              <button onClick={() => handleUnlike(post.id)}>Unlike</button>
              {isOwnPost && <button onClick={() => handleDelete(post.id)}>Delete</button>}

              {/* Follow/Unfollow Button */}
              {!isOwnPost && user && (
                <>
                  {isFollowing ? (
                    <button onClick={() => handleUnfollow(post.userId)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(post.userId)}>Follow</button>
                  )}
                </>
              )}

              <CommentSection postId={post.id} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default PostList;
