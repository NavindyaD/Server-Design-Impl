import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Helper to set JWT token in the headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
export const registerUser = (email, password) => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};

// Login user
export const loginUser = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

// Create new blog post
export const createPost = (title, content, country, date_of_visit) => {
  return axios.post(`${API_URL}/posts`, { title, content, country, date_of_visit });
};

// Get all posts
export const getPosts = (country = '', username = '') => {
  return axios.get(`${API_URL}/posts`, {
    params: { country, username }
  });
};

// Like a post
export const likePost = (post_id, value) => {
  return axios.post(`${API_URL}/likes`, { post_id, value });
};

// Follow a user
export const followUser = (following_id) => {
  return axios.post(`${API_URL}/follow/follow`, { following_id });
};

export { setAuthToken };
