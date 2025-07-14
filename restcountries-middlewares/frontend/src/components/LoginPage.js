import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3001/auth/login',
        { username, password },
        { withCredentials: true }
      );
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page" role="main" aria-label="Login form">
      <h2>Login</h2>
      {error && <p className="error-message" role="alert">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button onClick={login} aria-label="Submit login form">Login</button>
    </div>
  );
};

export default LoginPage;
