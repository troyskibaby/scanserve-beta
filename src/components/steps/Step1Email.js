import React, { useState } from 'react';

const EmailStep = ({ formData, setFormData, nextStep, setErrors, errors }) => {
  const [email, setEmail] = useState(formData.email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFormData({ ...formData, email: e.target.value }); // Update formData on email change
    setErrors({ ...errors, email: '' }); // Clear error when the user starts typing
  };

  return (
    <div >
      <h3>What's your email address?</h3>
      <div className="form-field">
        
        <input
        placeholder='Enter your email...'
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className={`input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      
    </div>
  );
};

export default EmailStep;
