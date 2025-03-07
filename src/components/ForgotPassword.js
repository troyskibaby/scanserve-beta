import React, { useState } from "react";

import config from '../config'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const API_URL =
    `${config.apiUrl}/requestPasswordReset?code=${config.key}`; // Update with actual URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the API returns an error for email not found, show a sign-up option
        if (data.message === "Email not found") {
          setError(
            <>
              <p>Email not found. Please check your email or</p>
              <a href="/signup" className="signup-link">
                Sign up for a new account
              </a>
            </>
          );
        } else {
          throw new Error(data.message || "Failed to send reset email.");
        }
      } else {
        setSuccessMessage(`A password reset link has been sent to ${email}. Please check your inbox.`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
        
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "input error" : "input"}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Checking..." : "Send Reset Link"}
        </button>

        <p className="forgot-password">
          <a href="/login">Back to Login</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
