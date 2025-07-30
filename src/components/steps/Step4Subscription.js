import React, { useState } from 'react';

const SubscriptionStep = ({ formData, setFormData, submitForm, prevStep, setErrors, errors }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(formData.subscriptionPlan || '');

  const plans = [
    {
      id: 'price_1RnmlHH5sjpXMfN6hDkb9WPt',
      name: 'Premium (Monthly)',
      description: 'Up to 100 boilers - £12.50/mo',
    },
    {
      id: 'price_1RnmlzH5sjpXMfN6redf8luF',
      name: 'Premium Plus (Annual)',
      description: 'Unlimited boilers - £200/yr',
    },
  ];

  const handleSubscriptionChange = (planId) => {
    setSubscriptionPlan(planId);
    setFormData({ ...formData, subscriptionPlan: planId });
    setErrors({ ...errors, subscriptionPlan: '' });
  };

  const handleSubmit = () => {
    if (!subscriptionPlan) {
      setErrors({ ...errors, subscriptionPlan: 'You must select a subscription plan' });
    } else {
      submitForm();
    }
  };

  return (
    <div>
      <h2>Choose Your Subscription Plan</h2>
      <p className="subtitle">Select a plan that best fits your needs.</p>

      <div className="subscription-cards">
        {plans.map((plan) => (
          <label
            key={plan.id}
            className={`card ${subscriptionPlan === plan.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="subscriptionPlan"
              value={plan.id}
              checked={subscriptionPlan === plan.id}
              onChange={() => handleSubscriptionChange(plan.id)}
              className="hidden"
            />
            <div className="card-content">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>Subscribe and Continue</button>
    </div>
  );
};

export default SubscriptionStep;
