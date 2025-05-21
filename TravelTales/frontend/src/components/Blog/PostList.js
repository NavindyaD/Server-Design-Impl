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
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
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
      const countryNames = data
        .map(country => country.name.common)
        .sort((a, b) => a.localeCompare(b));
      setCountries(countryNames);
      setFilteredCountries(countryNames);
    } catch (error) {
      console.error('Failed to fetch countries', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setFilteredCountries(
      countries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleDropdownSelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setSearchTerm(selectedCountry);
    setShowDropdown(false);
    filterPosts(selectedCountry, username);
  };

const filterPosts = async (selectedCountry = country, usernameInput = username) => {
  let filteredPosts = [...allPosts];

  // Case 1: Filter by country
  if (selectedCountry.trim()) {
    filteredPosts = filteredPosts.filter(post =>
      post.countryName === selectedCountry || post.country === selectedCountry
    );

    // Fetch and show country details based on selectedCountry
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${selectedCountry}?fullText=true`);
      const data = await response.json();
      const countryData = data[0];
      setCountryDetails({
        name: countryData.name.common,
        flag: countryData.flags?.png || countryData.flags?.svg,
        currency: Object.values(countryData.currencies || {})[0]?.name || 'Unknown',
        capital: countryData.capital?.[0] || 'Unknown',
      });
    } catch (error) {
      console.error('Error fetching country details:', error);
      setCountryDetails(null);
    }
  } else {
    setCountryDetails(null);  // Reset country details when no country is selected
  }

  // Case 2: Filter by username
  if (usernameInput.trim()) {
    filteredPosts = filteredPosts.filter(post =>
      post.User?.username.toLowerCase().includes(usernameInput.toLowerCase())
    );

    // Fetch and show the first user's country details (from their post)
    if (filteredPosts.length > 0 && filteredPosts[0].countryName) {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${filteredPosts[0].countryName}?fullText=true`);
        const data = await response.json();
        const countryData = data[0];
        setCountryDetails({
          name: countryData.name.common,
          flag: countryData.flags?.png || countryData.flags?.svg,
          currency: Object.values(countryData.currencies || {})[0]?.name || 'Unknown',
          capital: countryData.capital?.[0] || 'Unknown',
        });
      } catch (error) {
        console.error('Error fetching user country details:', error);
        setCountryDetails(null);
      }
    }
  }

  // Update the state with the filtered posts
  setPosts(filteredPosts);
};


  const handleLike = async (postId) => {
    try {
      await api.post('/blogposts/like', { blogPostId: postId });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likeCount: (post.likeCount ?? 0) + 1 }
            : post
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await api.post('/blogposts/unlike', { blogPostId: postId });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likeCount: Math.max((post.likeCount ?? 1) - 1, 0) }
            : post
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unlike post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/blogposts/${postId}`);
      setPosts(prev => prev.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleFollow = async (followingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to follow users');
        return;
      }
      await api.post('/follow/follow', { followingId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingList(prev => [...prev, followingId]);
      alert('Followed successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (followedUserId) => {
    if (!user) {
      alert('Please login to unfollow users.');
      return;
    }
    try {
      await api.delete(`/follow/unfollow/${followedUserId}`);
      setFollowingList(prev => prev.filter(id => id !== followedUserId));
      alert('Unfollowed successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const handleClearFilters = () => {
    setCountry('');
    setSearchTerm('');
    setUsername('');
    setShowDropdown(false);
    setCountryDetails(null);
    setPosts(allPosts); 
  };

  return (
    <div className="blog-container">
      <h2>Blog Posts</h2>

      <div className="filter-container">
        {/* Searchable Country Dropdown */}
        <div className="country-dropdown">
          <input
            type="text"
            placeholder="Search Country"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="dropdown-list">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country}
                    className="dropdown-item"
                    onClick={() => handleDropdownSelect(country)}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="dropdown-item">No results found</div>
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Filter by username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => filterPosts()}>Filter</button>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Country Info */}
      {countryDetails && (
        <div className="country-details">
          <h3>Country Info</h3>
          <img src={countryDetails.flag} alt={`${countryDetails.name} flag`} style={{ width: '100px' }} />
          <p><strong>Name:</strong> {countryDetails.name}</p>
          <p><strong>Capital:</strong> {countryDetails.capital}</p>
          <p><strong>Currency:</strong> {countryDetails.currency}</p>
        </div>
      )}

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
            <div key={post.id} className="post-item">
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
              <p><strong>Country:</strong> {post.countryName || post.country}</p>
              {post.flag && (
                <img src={post.flag} alt={`${post.countryName || post.country} flag`} />
              )}
              <p><strong>Date:</strong> {new Date(post.dateOfVisit || post.createdAt).toLocaleDateString()}</p>

              <div className="likes-info">
                <p><strong>Likes:</strong> {post.likeCount ?? 0}</p>
              </div>
              <div className="likes-info">
                <p><strong>Unlikes:</strong> {post.unlikeCount ?? 0}</p>
              </div>

              <div className="post-buttons">
                <button onClick={() => handleLike(post.id)}>
                  <FaThumbsUp style={{ color: 'blue', fontSize: '20px' }} /> Like
                </button>

                <button onClick={() => handleUnlike(post.id)}>
                  <FaThumbsDown style={{ color: 'red', fontSize: '20px' }} /> Unlike
                </button>

                {isOwnPost && <button onClick={() => handleDelete(post.id)}>Delete</button>}

                {!isOwnPost && user && (
                  isFollowing ? (
                    <button onClick={() => handleUnfollow(post.userId)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(post.userId)}>Follow</button>
                  )
                )}
              </div>

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
