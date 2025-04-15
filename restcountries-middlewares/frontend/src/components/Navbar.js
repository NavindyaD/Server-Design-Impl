import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee", display: "flex", gap: "1rem" }}>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/country">Country Search</Link>
          <Link to="/manage">Manage API Keys</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
