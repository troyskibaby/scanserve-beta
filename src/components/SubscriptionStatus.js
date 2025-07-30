// components/SubscriptionStatus.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const priceIdToPlanName = {
  'price_1RnmlHH5sjpXMfN6hDkb9WPt': 'Premium (Monthly)',
  'price_1RnmlHH5sjpXMfN6GgwQaKV4': 'Premium (Annual)',
  'price_1RnmllH5sjpXMfN6XrZTMKfT': 'Premium Plus (Monthly)',
  'price_1RnmlzH5sjpXMfN6redf8luF': 'Premium Plus (Annual)',
};

const SubscriptionStatus = () => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('/api/getSubscription', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) return <p>Loading subscription status...</p>;

  if (!subscription?.hasSubscription) {
    return <p>No active subscription found.</p>;
  }

  const planName = priceIdToPlanName[subscription.priceId] || 'Unknown Plan';
  const renewalDate = new Date(subscription.currentPeriodEnd).toLocaleDateString();

  return (
    <div className="subscription-status">
      <h3>Your Subscription</h3>
      <p><strong>Plan:</strong> {planName}</p>
      <p><strong>Status:</strong> {subscription.status}</p>
      <p><strong>Renews on:</strong> {renewalDate}</p>
      {subscription.cancelAtPeriodEnd && (
        <p style={{ color: 'red' }}><strong>Note:</strong> Your subscription will cancel at the end of this billing period.</p>
      )}
    </div>
  );
};

export default SubscriptionStatus;
