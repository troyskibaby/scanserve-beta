import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import config from '../config'; 

const VerificationMessage = () => {
  const location = useLocation();
  const email = location.state?.email || '';

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${config.apiUrl}/resendVerificationEmail?code=${config.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Verification email resent! Check your inbox.");
      } else {
        setMessage(result.message || "Error resending verification email.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <h2>Thank You for Signing Up!</h2>
      <p>We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.</p>

      {message && <p className="success-message">{message}</p>}

      <button onClick={handleResendVerification} disabled={loading} className="primary-button">
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>
    </div>
  );
};

export default VerificationMessage;
