import React, { useState } from 'react';
import api from '../api/axios';

function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', country: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/posts', form);
    alert('Post created!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Content" onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <input placeholder="Country" onChange={(e) => setForm({ ...form, country: e.target.value })} />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
