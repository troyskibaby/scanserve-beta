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
    setFormData({ ...formData, firstName: e.target.value }); // Update formData on first name change
    setErrors({ ...errors, name: '' });
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setFormData({ ...formData, lastName: e.target.value }); // Update formData on last name change
    setErrors({ ...errors, name: '' });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFormData({ ...formData, password: e.target.value }); // Update formData on password change
    setErrors({ ...errors, password: '' });
  };

  // Validate password requirements
  const validatePassword = () => {
    const failedRequirements = passwordRequirements.filter((req) => !req.test.test(password));
    if (failedRequirements.length > 0) {
      return failedRequirements.map((req) => req.message);
    }
    return [];
  };

  const handleNext = () => {
    const passwordErrors = validatePassword();
    if (passwordErrors.length > 0) {
      setErrors({ ...errors, password: passwordErrors });
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
          className={`input ${errors.name ? 'error' : ''}`}
        />

        {/* Last Name */}
        <input
          placeholder="Enter your last name..."
          type="text"
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
          className={`input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
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
        {errors.password && (
          <div className="error-message">
            {errors.password.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>

    
    </div>
  );
};

export default NameStep;
