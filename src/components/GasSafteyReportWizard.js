import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material';
import TenantDetailsStep from './GasSafetySteps/TenantDetailsStep';
import LandlordDetailsStep from './GasSafetySteps/LandlordDetailsStep.js';

const steps = ['Tenant / Homeowner Details', 'Landlord / Agent Details'];

const GasSafetyReportWizard = ({ boiler }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantPresent: '',
    landlordApplicable: true,
    landlordName: '',
    landlordPresent: '',
  });

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const updateData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
    handleNext();
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Gas Safety Report</Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
          {steps.map((label, index) => (
            <Step key={index}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <TenantDetailsStep boiler={boiler} formData={formData} updateData={updateData} />
        )}
        {activeStep === 1 && (
          <LandlordDetailsStep boiler={boiler} formData={formData} updateData={updateData} onBack={handleBack} />
        )}
      </Paper>
    </Box>
  );
};

export default GasSafetyReportWizard;
