import React, { useState } from 'react';
import EmailStep from './steps/Step1Email';
import NameStep from './steps/Step2Name';
import AccountTypeStep from './steps/Step3AccountType';
import SubscriptionStep from './steps/Step4Subscription';
import { Stepper, Step, StepLabel } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    accountType: '',
    password: '',
    subscriptionPlan: ''
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const prevStep = () => setCurrentStep(currentStep - 1);

  const validateStep = () => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.lastName) {
          newErrors.name = 'Please enter both first and last names';
          isValid = false;
        } else {
          delete newErrors.name;
        }
        break;
      case 2:
        if (!formData.accountType) {
          newErrors.accountType = 'Please select an account type';
          isValid = false;
        } else {
          delete newErrors.accountType;
        }
        break;
      case 3:
        if (!formData.subscriptionPlan) {
          newErrors.subscriptionPlan = 'Please select a subscription plan';
          isValid = false;
        } else {
          delete newErrors.subscriptionPlan;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setConfirmationMessage('Redirecting to secure Stripe Checkout...');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          priceId: formData.subscriptionPlan
        })
      });

      const data = await res.json();

      if (data.url) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500); // short delay to show confirmation
      } else {
        alert('Subscription error');
        setIsSubmitting(false);
        setConfirmationMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Subscription error');
      setIsSubmitting(false);
      setConfirmationMessage('');
    }
  };

  const steps = [
    'Enter Email',
    'Enter Name',
    'Select Account Type',
    'Choose Subscription Plan'
  ];

  const stepComponents = [
    <EmailStep formData={formData} setFormData={setFormData} nextStep={nextStep} errors={errors} setErrors={setErrors} />,
    <NameStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} errors={errors} setErrors={setErrors} />,
    <AccountTypeStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} errors={errors} setErrors={setErrors} />,
    <SubscriptionStep formData={formData} setFormData={setFormData} submitForm={submitForm} prevStep={prevStep} errors={errors} setErrors={setErrors} />
  ];

  return (
    <div className="signup-container">
      <Stepper activeStep={currentStep}>
        {steps.map((label, index) => (
          <Step key={index}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {stepComponents[currentStep]}

      {isSubmitting && (
        <div className="loading-indicator">
          <p>{confirmationMessage}</p>
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

export default SignUp;
