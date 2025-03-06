import React, { useState } from 'react';

const SubscriptionStep = ({ formData, setFormData, submitForm, prevStep, setErrors, errors }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(formData.subscriptionPlan || '');

  const handleSubscriptionChange = (plan) => {
    setSubscriptionPlan(plan);
    setFormData({ ...formData, subscriptionPlan: plan });
    setErrors({ ...errors, subscriptionPlan: '' }); // Clear error when selection is made
  };

  const handleSubmit = () => {
    if (!subscriptionPlan) {
      setErrors({ ...errors, subscriptionPlan: 'You must select a subscription plan' });
    } else {
      submitForm(); // Call submitForm to finalize sign-up
    }
  };

  return (
    <div>
      <h2>Choose Your Subscription Plan</h2>
      <p className="subtitle">Select a plan that best fits your needs.</p>

      <div className="subscription-cards">
        {/* Basic Plan Option */}
        <label className={`card ${subscriptionPlan === 'Basic' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="subscriptionPlan"
            value="Basic"
            checked={subscriptionPlan === 'Basic'}
            onChange={() => handleSubscriptionChange('Basic')}
            className="hidden"
          />
          <div className="card-content">
            <h3>Basic</h3>
            <p>Access to standard features</p>
          </div>
        </label>

        {/* Premium Plan Option */}
        <label className={`card ${subscriptionPlan === 'Premium' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="subscriptionPlan"
            value="Premium"
            checked={subscriptionPlan === 'Premium'}
            onChange={() => handleSubscriptionChange('Premium')}
            className="hidden"
          />
          <div className="card-content">
            <h3>Premium</h3>
            <p>Access to all features, including premium tools</p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {errors.subscriptionPlan && <p className="error-message">{errors.subscriptionPlan}</p>}

      {/* Navigation Buttons */}
      <div className="step-buttons">
        <button onClick={prevStep} className="secondary-button">Back</button>
        <button onClick={handleSubmit} className="primary-button">Submit</button>
      </div>
    </div>
  );
};

export default SubscriptionStep;
