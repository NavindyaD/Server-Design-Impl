import React, { useState } from 'react';
import api from '../../api/axios';

const CreatePost = () => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    countryName: '',
    dateOfVisit: '',
  });

  const handleChange = (e) =>
    setPost({ ...post, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/blogposts/create', post);
      alert('Post created successfully!');
    } catch (error) {
      alert(error.response.data.message || 'Post creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <input
        name="countryName"
        placeholder="Country Name"
        value={post.countryName}
        onChange={handleChange}
        required
      />
      <input
        name="dateOfVisit"
        type="date"
        value={post.dateOfVisit}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
