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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryNames = response.data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) =>
    setPost({ ...post, [e.target.name]: e.target.value });

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
      <select
        name="countryName"
        value={post.countryName}
        onChange={handleChange}
        required
      >
        <option value="">Select Country</option>
        {countries.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
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
