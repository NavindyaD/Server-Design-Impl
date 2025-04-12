import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>

        {isLoggedIn && (
          <>
            <li><Link to="/country">Country Info</Link></li>
            <li><Link to="/apikey">API Key Management</Link></li> {/* ✅ Now visible when logged in */}
            <li><Link to="/logout">Logout</Link></li>
          </>
        )}

        {!isLoggedIn && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
