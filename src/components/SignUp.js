import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import EmailStep from './steps/Step1Email';
import NameStep from './steps/Step2Name';
import AccountTypeStep from './steps/Step3AccountType';
import SubscriptionStep from './steps/Step4Subscription';
import { Stepper, Step, StepLabel } from '@mui/material';
import config from '../config'; 


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
  const totalSteps = 4;

  const navigate = useNavigate(); // Hook for navigation

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

  // **Submit Form and Redirect to Verification Page**
  const submitForm = async () => {
    setIsSubmitting(true); // Disable buttons during submission

    try {
      const API_URL =
        `${config.apiUrl}/registerUser?code=${config.key}`;

      const payload = {
        Email: formData.email,
        PasswordHash: formData.password,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Phone: formData.phone || '',
        RoleID: formData.accountType === 'Plumber' ? 2 : 1,
        PlanID: formData.subscriptionPlan === 'Premium' ? 5 : 4,
        DateCreated: new Date().toISOString(),
        SubscriptionStartDate: new Date().toISOString(),
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

      // **Redirect user to verification screen**
      navigate('/verifyemail', { state: { email: formData.email } });

      
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert(error.message || 'An error occurred while creating your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-container">
      <Stepper activeStep={currentStep} alternativeLabel>
        {['Your email', 'Your details', 'Role', 'Subscription'].map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

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
          submitForm={submitForm} // Now calls the API and redirects
          prevStep={prevStep}
          setErrors={setErrors}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      )}
      <p className="forgot-password">
          Already have an account?<a href="/login"> Login here</a>
        </p>
    </div>
  );
};

export default SignUp;
