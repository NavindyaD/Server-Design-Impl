import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/create-post">Create Post</Link>
          <Link to="/feed">Feed</Link>
          <Link to={`/followers/${user?.id}`}>Followers</Link>
          <Link to={`/following/${user?.id}`}>Following</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
