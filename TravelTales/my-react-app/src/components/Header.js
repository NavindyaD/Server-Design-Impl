import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/liked-posts">Liked Posts</Link> {/* Link to Liked Posts */}
      </nav>
    </header>
  );
};

export default Header;
