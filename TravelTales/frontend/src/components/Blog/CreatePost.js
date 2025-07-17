import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axios';
import './Post.css';

const CreatePost = () => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    countryName: '',
    dateOfVisit: '',
  });

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected response from countries API:', data);
      return;
    }

    const countryNames = data
      .map((country) => country.name?.common)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    setCountries(countryNames);
    setFilteredCountries(countryNames);
  } catch (error) {
    console.error('Failed to fetch countries:', error);
  }
};


    fetchCountries();
  }, []);

  // Filter countries based on search term
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    setFilteredCountries(
      countries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleChange = (e) =>
    setPost({ ...post, [e.target.name]: e.target.value });

  const handleDropdownSelect = (country) => {
    setPost({ ...post, countryName: country });
    setSearchTerm(country);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!post.countryName) {
        setError('Please select a country.');
        return;
      }

      await api.post('/blogposts/create', post);
      alert('Post created successfully!');

      // Reset form
      setPost({
        title: '',
        content: '',
        countryName: '',
        dateOfVisit: '',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Post creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <input
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Content"
        value={post.content}
        onChange={handleChange}
        required
      />

      {/* Searchable dropdown with countries */}
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
        name="dateOfVisit"
        type="date"
        value={post.dateOfVisit}
        onChange={handleChange}
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
