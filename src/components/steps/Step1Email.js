import React, { useState } from 'react';
import config from '../../config'; 

const EmailStep = ({ formData, setFormData, nextStep, setErrors, errors }) => {
  const [email, setEmail] = useState(formData.email || '');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFormData({ ...formData, email: e.target.value });
    setErrors({ ...errors, email: '' }); // Clear error when user types
  };

  // Validate email format using a simple regex.
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Check if email exists by calling the API endpoint.
  const checkEmailExists = async () => {
    if (!email || !isValidEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      // Use a template literal with backticks to properly inject config values.
      const response = await fetch(
        `${config.apiUrl}/checkEmail?code=${config.key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.exists) {
        setErrors({ ...errors, email: 'This email is already registered. Please sign in.' });
      } else {
        nextStep(); // Move to the next step if the email doesn't exist.
      }
    } catch (error) {
      setErrors({ ...errors, email: 'Error checking email. Try again later.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>What's your email address?</h3>
      <div className="form-field">
        <input
          placeholder="Enter your email..."
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className={`input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      <div className="step-buttons">
        <button className="primary-button" onClick={checkEmailExists} disabled={loading}>
          {loading ? 'Checking...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default EmailStep;
