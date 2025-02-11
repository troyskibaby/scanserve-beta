import React, { useState } from 'react';

const SubscriptionStep = ({ formData, setFormData, nextStep, prevStep, setErrors, errors }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(formData.subscriptionPlan || '');

  const handleSubscriptionChange = (plan) => {
    setSubscriptionPlan(plan);
    setFormData({ ...formData, subscriptionPlan: plan });
    setErrors({ ...errors, subscriptionPlan: '' });
  };

  const validateSubscription = () => {
    if (!subscriptionPlan) {
      setErrors({ ...errors, subscriptionPlan: 'Please select a subscription plan' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateSubscription()) {
      nextStep();
    }
  };

  return (
    <div>
      <h2>Choose Your Subscription Plan</h2>
      
      <div className="account-type-cards">
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
            <p><li>Register up to 3 boilers</li></p>
            <p><li>Boiler maintenance and service history</li></p>
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
            <p><li>Register unlimited boilers</li></p>
            <p><li>Boiler maintenance and service history</li></p>
            <p><li>Receive yearly service reminders</li></p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {errors.subscriptionPlan && (
        <p className="error-message">{errors.subscriptionPlan}</p>
      )}

    
    </div>
  );
};

export default SubscriptionStep;
