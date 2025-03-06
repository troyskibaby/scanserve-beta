import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegistrationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, message } = location.state || {};

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    // Navigate back to the first step of the registration form
    navigate('/registerboiler');
  };

  return (
    <div className="result-container" style={{ textAlign: 'center', padding: '20px' }}>
      <h2>{success ? "Success!" : "Registration Failed"}</h2>
      <p>{message}</p>
      {success ? (
        <button onClick={handleDashboard} className="primary-button">
          Go to Dashboard
        </button>
      ) : (
        <button onClick={handleRetry} className="secondary-button">
          Retry Registration
        </button>
      )}
    </div>
  );
};

export default RegistrationResult;
