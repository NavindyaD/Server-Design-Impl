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
  const [multipleCountryDetails, setMultipleCountryDetails] = useState([]); // NEW
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
      setMultipleCountryDetails([]); // Reset multiple details
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
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected response format from countries API:', data);
        return;
      }
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

    if (selectedCountry.trim()) {
      filteredPosts = filteredPosts.filter(post =>
        post.countryName === selectedCountry || post.country === selectedCountry
      );
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
        setMultipleCountryDetails([]); // Clear multi-country if switching to single
      } catch (error) {
        console.error('Error fetching country details:', error);
        setCountryDetails(null);
      }
    } else {
      setCountryDetails(null);
    }

    if (usernameInput.trim()) {
      filteredPosts = filteredPosts.filter(post =>
        post.User?.username.toLowerCase().includes(usernameInput.toLowerCase())
      );

      const uniqueCountries = [
        ...new Set(filteredPosts.map(post => post.countryName || post.country).filter(Boolean))
      ];

      try {
        const promises = uniqueCountries.map(country =>
          fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
            .then(res => res.json())
            .then(data => ({
              name: data[0]?.name?.common || country,
              flag: data[0]?.flags?.png || data[0]?.flags?.svg || '',
              currency: Object.values(data[0]?.currencies || {})[0]?.name || 'Unknown',
              capital: data[0]?.capital?.[0] || 'Unknown'
            }))
        );

        const allCountryDetails = await Promise.all(promises);
        setMultipleCountryDetails(allCountryDetails);
        setCountryDetails(null); // Clear single country when showing multiple
      } catch (error) {
        console.error('Error fetching multiple country details:', error);
        setMultipleCountryDetails([]);
      }
    }

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
            ? { ...post, unlikeCount: Math.max((post.unlikeCount ?? 1) - 1, 0) }
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
    setMultipleCountryDetails([]); // Clear multi-country data
    setPosts(allPosts);
  };

  return (
    <div className="blog-container">
      <h2>Blog Posts</h2>

      <div className="filter-container">
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

      {countryDetails && (
        <div className="country-details">
          <h3>Country Info</h3>
          <img src={countryDetails.flag} alt={`${countryDetails.name} flag`} style={{ width: '100px' }} />
          <p><strong>Name:</strong> {countryDetails.name}</p>
          <p><strong>Capital:</strong> {countryDetails.capital}</p>
          <p><strong>Currency:</strong> {countryDetails.currency}</p>
        </div>
      )}

      {multipleCountryDetails.length > 0 && (
        <div className="multiple-country-details">
          <h3>Countries User Has Posted About:</h3>
          <div className="country-cards">
            {multipleCountryDetails.map((country, index) => (
              <div key={index} className="country-card">
                <img src={country.flag} alt={`${country.name} flag`} style={{ width: '80px' }} />
                <p><strong>Name:</strong> {country.name}</p>
                <p><strong>Capital:</strong> {country.capital}</p>
                <p><strong>Currency:</strong> {country.currency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
