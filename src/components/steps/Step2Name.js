import React, { useState } from 'react';

const NameStep = ({ formData, setFormData, nextStep, prevStep, setErrors, errors }) => {
  const [firstName, setFirstName] = useState(formData.firstName);
  const [lastName, setLastName] = useState(formData.lastName);
  const [password, setPassword] = useState(formData.password);

  // Regular expressions for password validation
  const passwordRequirements = [
    { test: /.{8,}/, message: 'Must contain at least 8 characters' },
    { test: /[A-Z]/, message: 'Must contain at least one uppercase letter' },
    { test: /[a-z]/, message: 'Must contain at least one lowercase letter' },
    { test: /\d/, message: 'Must contain at least one number' },
    { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'Must contain at least one special character' },
  ];

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFormData({ ...formData, firstName: e.target.value });
    setErrors({ ...errors, firstName: '' });
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setFormData({ ...formData, lastName: e.target.value });
    setErrors({ ...errors, lastName: '' });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFormData({ ...formData, password: e.target.value });
    setErrors({ ...errors, password: '' });
  };

  // Validate password requirements
  const validatePassword = () => {
    return passwordRequirements
      .filter((req) => !req.test.test(password))
      .map((req) => req.message);
  };

  const handleNext = () => {
    const passwordErrors = validatePassword();
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!password.trim()) {
      newErrors.password = ['Password is required'];
    } else if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <h2>Let’s set up your account</h2>
      <div className="form-field-inline">
        {/* First Name */}
        <input
          placeholder="Enter your first name..."
          type="text"
          id="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
          className={`input ${errors.firstName ? 'error' : ''}`}
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        {/* Last Name */}
        <input
          placeholder="Enter your last name..."
          type="text"
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
          className={`input ${errors.lastName ? 'error' : ''}`}
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
      </div>

      {/* Password Field */}
      <div className="form-field">
        <input
          placeholder="Enter your password..."
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className={`input ${errors.password ? 'error' : ''}`}
        />

        {/* Password Requirements */}
        <div className="password-requirements">
          {passwordRequirements.map((req, index) => (
            <div key={index} className="password-item">
              <span className={req.test.test(password) ? 'valid-icon' : 'invalid-icon'}>
                {req.test.test(password) ? '✅' : '❌'}
              </span>
              <p className={req.test.test(password) ? 'valid' : 'invalid'}>{req.message}</p>
            </div>
          ))}
        </div>

        {/* Password Validation Errors */}
       
      </div>

      {/* Navigation Buttons */}
      <div className="step-buttons">
        <button onClick={prevStep} className="secondary-button">Previous</button>
        <button onClick={handleNext} className="primary-button">Next</button>
      </div>
    </div>
  );
};

export default NameStep;
