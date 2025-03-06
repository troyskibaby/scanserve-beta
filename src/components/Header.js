// Header.js
import React, { useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token cookie and update context
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>Welcome to ScanServe</h1>
        <p>Service history from a scan</p>
        <Link to="#">How it works</Link>
      </div>
      <div className="header-right">
        
        {user ? (
          <div className="header-user-container">
            <div className="header-user">
              Hi, {user.FirstName || user.firstName || "User"}!
            </div>
            <button onClick={handleLogout} className="header-logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="header-signin">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
