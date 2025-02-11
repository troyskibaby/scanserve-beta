import React, { useState } from 'react';

const AccountTypeStep = ({ formData, setFormData, nextStep, prevStep, setErrors, errors }) => {
  const [accountType, setAccountType] = useState(formData.accountType);

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
    setFormData({ ...formData, accountType: e.target.value }); // Update formData on account type change
    setErrors({ ...errors, accountType: '' }); // Clear any error
  };

  return (
    <div >
      <h2>What role best describes you?</h2>
      
      <div className="account-type-cards">
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

      {errors.accountType && <p className="error-message">{errors.accountType}</p>}

     
    </div>
  );
};

export default AccountTypeStep;
