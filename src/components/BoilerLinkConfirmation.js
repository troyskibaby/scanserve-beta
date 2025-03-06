import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";
import config from '../config';

const BoilerLinkConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting boilerID to be passed in the state from registration.
  const { boilerID } = location.state || {};
  const [linking, setLinking] = useState(false);
  const [message, setMessage] = useState('');

  // If no boilerID was provided, inform the user and offer to navigate back.
  if (!boilerID) {
    return (
      <div className="login-container">
        <h2>Error</h2>
        <p>No boiler record found to link.</p>
        <button onClick={() => navigate('/dashboard')} className="primary-button">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleLinkYes = async () => {
    // Check if the user is signed in by checking for the "token" cookie.
    const token = Cookies.get('token');
    if (!token) {
      setMessage("You need to create an account to link your boiler. Please");
      setLinking(false);
      return;
    }

    setLinking(true);
    setMessage('');
    try {
      const API_URL = `${config.apiUrl}/linkBoiler?code=${config.key}`;
      // The API should extract the UserID from the "token" cookie.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ boilerID })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Linking failed. Please try again.');
      } else {
        setMessage('Boiler linked successfully!');
        // Redirect to dashboard after a short delay.
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error("Error linking boiler:", error);
      setMessage('An error occurred while linking the boiler. Please try again.');
    } finally {
      setLinking(false);
    }
  };

  // Optional handler if the user declines linking.
  const handleLinkNo = () => {
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h2>Boiler Registration Complete</h2>
      <h2>🎉</h2>
      <p>Your boiler has been registered successfully.</p>
      <p><b>Would you like to link this boiler to your account?</b></p>
      <div className="step-buttons">
      <button onClick={handleLinkNo} disabled={linking} className="secondary-button" style={{ marginLeft: '10px' }}>
          No
        </button>
        <button onClick={handleLinkYes} disabled={linking} className="primary-button">
          {linking ? 'Linking boiler...' : 'Yes'}
        </button>
        
      </div>
      {message && (
        <p style={{ marginTop: '10px' }}>
          {message}
          {/* If no token exists, render a Sign Up link */}
          {!Cookies.get('token') && (
            <span> <Link to="/signup" state={{ boilerID }}>Sign Up</Link> or <Link to="/login" state={{ boilerID }}>Login</Link>.</span>
          )}
        </p>
      )}
    </div>
  );
};

export default BoilerLinkConfirmation;
