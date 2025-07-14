import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate
} from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import CountryInfo from './components/CountryInfo';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserProfile from './components/UserProfile';

import './App.css';

function AppRoutes() {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      credentials: 'include', // important for session cookies
    });
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  return (
    <>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Country Info</Link> |{' '}
        <Link to="/admin">Admin Dashboard</Link> |{' '}
        <Link to="/profile">Profile</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link> |{' '}
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<CountryInfo />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
