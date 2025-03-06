import React, { useState } from 'react';

const AccountTypeStep = ({ formData, setFormData, nextStep, prevStep, setErrors, errors }) => {
  const [accountType, setAccountType] = useState(formData.accountType || '');

  const handleAccountTypeChange = (e) => {
    const selectedType = e.target.value;
    setAccountType(selectedType);
    setFormData({ ...formData, accountType: selectedType });
    setErrors({ ...errors, accountType: '' }); // Clear error when selection is made
  };

  const handleNext = () => {
    if (!accountType) {
      setErrors({ ...errors, accountType: 'You must select a role' });
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <h2>What role best describes you?</h2>

      <div className="account-type-cards">
        {/* Homeowner Card */}
        <label className={`card ${accountType === 'Homeowner' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="accountType"
            value="Homeowner"
            checked={accountType === 'Homeowner'}
            onChange={handleAccountTypeChange}
            className="hidden"
          />
          <div className="card-content">
            <h3>Homeowner</h3>
            <p>Manage your home's boiler and track its service history.</p>
          </div>
        </label>

        {/* Plumber Card */}
        <label className={`card ${accountType === 'Plumber' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="accountType"
            value="Plumber"
            checked={accountType === 'Plumber'}
            onChange={handleAccountTypeChange}
            className="hidden"
          />
          <div className="card-content">
            <h3>Plumber</h3>
            <p>Manage your clients' boilers, service records, and history.</p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {errors.accountType && <p className="error-message">{errors.accountType}</p>}

      {/* Navigation Buttons */}
      <div className="step-buttons">
        <button onClick={prevStep} className="secondary-button">Back</button>
        <button onClick={handleNext} className="primary-button">Next</button>
      </div>
    </div>
  );
};

export default AccountTypeStep;
