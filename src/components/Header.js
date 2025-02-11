import React from 'react';
import './Header.css';  // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Welcome to ScanServe</h1>
        <p>Service history from a scan</p>
      </div>
      <div className="header-right">
        <img src="logo.png" alt="ScanServe Logo" style={{ height: '50px' }} />
        <a href="#">How it works</a>
      </div>
    </header>
  );
};

export default Header;
