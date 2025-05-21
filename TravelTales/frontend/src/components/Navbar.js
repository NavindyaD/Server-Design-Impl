import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/create-post">Create Post</Link>
          {/* Pass user.id dynamically to User Posts */}
          <Link to={`/userPosts/${user.id}`}>User Posts</Link>
          <Link to={`/feed`}>Feed Posts</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <div className="auth-links">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
