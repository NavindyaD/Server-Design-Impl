import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', credentials);

      const { user, token } = response.data;

      // Combine user info and token into a single object
      const userWithToken = { ...user, token };

      // Store token (optional since it's also in context)
      localStorage.setItem('token', token);

      // Login using full user object
      login(userWithToken);

      alert('Login successful!');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
