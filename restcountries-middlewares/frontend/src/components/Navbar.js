import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../assets/css/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav>
      {isLoggedIn && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/country">Country Search</Link>
          <Link to="/manage">Manage API Keys</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
