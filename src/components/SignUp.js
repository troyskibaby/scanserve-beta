import React, { useState } from 'react';
import EmailStep from './steps/Step1Email';
import NameStep from './steps/Step2Name';
import AccountTypeStep from './steps/Step3AccountType';
import SubscriptionStep from './steps/Step4Subscription';
import ProgressDots from './ProgressDots'; // Assuming you already have this component

import { Stepper, Step, StepLabel, Button } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    accountType: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const totalSteps = 4;

  // Handle next and previous steps
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  // Form validation per step
  const validateStep = () => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (currentStep) {
      case 0: // Validate email
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
          isValid = false;
        } else {
          delete newErrors.email;
        }
        break;

      case 1: // Validate first name and last name
        if (!formData.firstName || !formData.lastName) {
          newErrors.name = 'Please enter both first and last names';
          isValid = false;
        } else {
          delete newErrors.name;
        }
        break;

      case 2: // Validate account type
        if (!formData.accountType) {
          newErrors.accountType = 'Please select an account type';
          isValid = false;
        } else {
          delete newErrors.accountType;
        }
        break;

      case 3: // Validate password
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
          isValid = false;
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit form data to API
  const submitForm = async () => {
    setIsSubmitting(true); // Disable buttons while submitting

    try {
      const API_URL =
        'https://boilerauthfunctions.azurewebsites.net/api/registerUser?code=i8J-zgMagFqNfYAEiFT1kXrELY0MQFgi61ZpJt_F3RpuAzFumZmBWg%3D%3D';

        const payload = {
          Email: formData.email,
          PasswordHash: formData.password, // Assuming the API hashes the password itself
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Phone: formData.phone || '', // Include phone if optional
          RoleID: formData.accountType === 'Plumber' ? 2 : 1, // Assuming '2' = Plumber, '1' = Homeowner
          PlanID: formData.accountType === 'Premium' ? 5 : 4, // Assuming PlanID corresponds to role
          DateCreated: new Date().toISOString(), // Current timestamp
          SubscriptionStartDate: new Date().toISOString(), // Assuming subscription starts immediately
        };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register. Please try again.');
      }

      const result = await response.json();
      console.log('Form Submitted:', result);

      alert('Account created successfully!');
      // Optionally redirect the user or clear the form
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert(error.message || 'An error occurred while creating your account.');
    } finally {
      setIsSubmitting(false); // Re-enable buttons
    }
  };

  return (
    <div className="step-container">
      {/* Progress Bar */}
      <Stepper activeStep={currentStep} alternativeLabel>
        {['Your email', 'Your details', 'Role', 'Subscription'].map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Render the corresponding form step */}
      {currentStep === 0 && (
        <EmailStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          setErrors={setErrors}
          errors={errors}
        />
      )}
      {currentStep === 1 && (
        <NameStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          setErrors={setErrors}
          errors={errors}
        />
      )}
      {currentStep === 2 && (
        <AccountTypeStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          setErrors={setErrors}
          errors={errors}
        />
      )}
      {currentStep === 3 && (
        <SubscriptionStep
          formData={formData}
          setFormData={setFormData}
          submitForm={submitForm}
          prevStep={prevStep}
          setErrors={setErrors}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Back and Next buttons */}
      <div className="step-buttons">
        <Button
          className="secondary-button"
          variant="outlined"
          color="primary"
          onClick={prevStep}
          disabled={currentStep === 0 || isSubmitting}
        >
          Previous
        </Button>
        <Button
          className="primary-button"
          variant="contained"
          color="primary"
          onClick={currentStep === totalSteps - 1 ? submitForm : nextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
