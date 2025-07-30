// components/PlanSelection.js
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const plans = [
  {
    name: 'Premium',
    description: 'Up to 100 boilers. All features. Sole traders.',
    monthlyPriceId: 'price_1RnmlHH5sjpXMfN6hDkb9WPt',
    annualPriceId: 'price_1RnmlHH5sjpXMfN6GgwQaKV4',
    monthlyCost: '£12.50',
    annualCost: '£120.00',
  },
  {
    name: 'Premium Plus',
    description: 'Unlimited boilers. Best for busy engineers.',
    monthlyPriceId: 'price_1RnmllH5sjpXMfN6XrZTMKfT',
    annualPriceId: 'price_1RnmlzH5sjpXMfN6redf8luF',
    monthlyCost: '£20.00',
    annualCost: '£200.00',
  },
];

const PlanSelection = () => {
  const { user } = useContext(AuthContext);

  const subscribe = async (priceId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert('Subscription failed to initialize.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      alert('An error occurred. See console for details.');
    }
  };

  return (
    <div className="plan-selection">
      <h2>Select Your Subscription Plan</h2>
      <div className="plans">
        {plans.map((plan) => (
          <div key={plan.name} className="plan-card">
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <p><strong>{plan.monthlyCost}/month</strong> or <strong>{plan.annualCost}/year</strong></p>
            <button onClick={() => subscribe(plan.monthlyPriceId)}>Subscribe Monthly</button>
            <button onClick={() => subscribe(plan.annualPriceId)}>Subscribe Annually</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelection;
