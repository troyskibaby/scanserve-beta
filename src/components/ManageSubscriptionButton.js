// components/ManageSubscriptionButton.js
import React from 'react';

const ManageSubscriptionButton = () => {
  const handleClick = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/createPortalSession', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.url) {
        window.open(data.url, '_blank'); // Open Stripe portal in new tab
      } else {
        alert('Could not load Stripe billing portal.');
      }
    } catch (err) {
      console.error('Portal session error:', err);
      alert('An error occurred while opening the billing portal.');
    }
  };

  return (
    <button onClick={handleClick}>
      Manage My Subscription
    </button>
  );
};

export default ManageSubscriptionButton;
