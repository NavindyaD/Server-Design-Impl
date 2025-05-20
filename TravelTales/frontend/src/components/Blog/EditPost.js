import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './Post.css';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedCountryName, setUpdatedCountryName] = useState('');
  const [updatedDateOfVisit, setUpdatedDateOfVisit] = useState('');
  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all');
        const names = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(names);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch post data
  useEffect(() => {
    if (!id) {
      setError('Post ID is missing');
      setLoading(false);
      return;
    }

    if (!user?.token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogposts/postsById/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = res.data;

        setPost(data);
        setUpdatedTitle(data.title);
        setUpdatedContent(data.content);
        setUpdatedCountryName(data.countryName);

        const formattedDate = data.dateOfVisit ? data.dateOfVisit.split('T')[0] : '';
        setUpdatedDateOfVisit(formattedDate);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post details');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogposts/posts/${id}`,
        {
          title: updatedTitle,
          content: updatedContent,
          countryName: updatedCountryName,
          dateOfVisit: updatedDateOfVisit,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      console.log('Post updated successfully:', res.data);
      setSuccessMessage('Post updated successfully! Redirecting...');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post.');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <select
            value={updatedCountryName}
            onChange={(e) => setUpdatedCountryName(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date of Visit:</label>
          <input
            type="date"
            value={updatedDateOfVisit}
            onChange={(e) => setUpdatedDateOfVisit(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
