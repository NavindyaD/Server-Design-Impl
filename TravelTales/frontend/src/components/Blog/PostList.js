import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import CommentSection from '../CommentSection';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './PostList.css';

const PostList = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);
  const [country, setCountry] = useState('');
  const [username, setUsername] = useState('');
  const [followingList, setFollowingList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchAllPosts(sortOption);
    if (user) fetchFollowingList(user.id);
    fetchCountries();
  }, [user, sortOption]);

  const fetchAllPosts = async (sort = sortOption) => {
    try {
      const response = await api.get(`/blogposts/posts/sort?sortBy=${sort}`);
      setAllPosts(response.data);
      setPosts(response.data);
      setCountryDetails(null);
    } catch (error) {
      alert('Failed to fetch posts');
    }
  };

  const filterPosts = () => {
    let filteredPosts = [...allPosts];

    // Filter by country
    if (country.trim()) {
      filteredPosts = filteredPosts.filter(post => post.countryName === country || post.country === country);
    }

    // Filter by username
    if (username.trim()) {
      filteredPosts = filteredPosts.filter(post => post.User?.username.toLowerCase().includes(username.toLowerCase()));
    }

    setPosts(filteredPosts);
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

  const fetchFollowingList = async (userId) => {
    try {
      const response = await api.get(`/follow/following/${userId}`);
      setFollowingList(response.data.map(u => u.id));
    } catch (error) {
      console.error('Failed to fetch following list', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const countryList = data
        .map(country => ({
          name: country.name.common,
          code: country.cca2,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setCountries(countryList);
    } catch (error) {
      console.error('Failed to fetch countries', error);
    }
  };

  const handleFollow = async (followingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to follow users');
        return;
      }

      await api.post('/follow/follow',
        { followingId },
        { headers: { Authorization: `Bearer ${token}` } }
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
      await api.delete(`http://localhost:5000/api/follow/unfollow/${followedUserId}`);
      fetchFollowingList(user.id);
      alert('Successfully unfollowed the user');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const refreshPosts = () => {
    if (country.trim() || username.trim()) {
      filterPosts();
    } else {
      setPosts(allPosts);
    }
  };

  return (
    <div className="blog-container">
      <h2>Blog Posts</h2>

      <div className="filter-container">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={filterPosts}>Filter</button>
        <button
          onClick={() => {
            setCountry('');
            setUsername('');
            setPosts(allPosts);
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Sorting Dropdown */}
      <div className="sort-container">
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            fetchAllPosts(e.target.value);
          }}
        >
          <option value="newest">Newest</option>
          <option value="most_liked">Most Liked</option>
          <option value="most_commented">Most Commented</option>
        </select>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => {
          const isFollowing = followingList.includes(post.userId);
          const isOwnPost = user && user.id === post.userId;
          return (
            <div
              key={post.id}
              className="post-item"
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
                />
              )}
              <p>
                <strong>Date:</strong>{' '}
                {new Date(post.dateOfVisit || post.createdAt).toLocaleDateString()}
              </p>
              <div className="likes-info">
                <p>
                  <strong>Likes:</strong> {post.likeCount ?? 0}
                </p>
              </div>

              <div className="post-buttons">
                <button onClick={() => handleLike(post.id)}>
                  <FaThumbsUp style={{ color: 'blue', fontSize: '20px' }} /> Like
                </button>

                <button onClick={() => handleUnlike(post.id)}>
                  <FaThumbsDown style={{ color: 'red', fontSize: '20px' }} /> Unlike
                </button>

                {isOwnPost && <button onClick={() => handleDelete(post.id)}>Delete</button>}

                {/* Follow/Unfollow */}
                {!isOwnPost && user && (
                  isFollowing ? (
                    <button onClick={() => handleUnfollow(post.userId)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(post.userId)}>Follow</button>
                  )
                )}
              </div>

              {/* Comments */}
              <div className="comment-section">
                <CommentSection postId={post.id} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PostList;
