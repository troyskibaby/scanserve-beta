import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Paper } from '@mui/material';

import TenantDetailsStep from './GasSafetySteps/TenantDetailsStep';
import LandlordDetailsStep from './GasSafetySteps/LandlordDetailsStep';
import ApplianceListStep from './GasSafetySteps/ApplianceListStep';
import AddApplianceStepper from './GasSafetySteps/AddApplianceStepper';

const steps = ['Tenant Info', 'Landlord Info', 'Appliances', 'Add Appliance'];

const GasSafetyWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tenantDetails, setTenantDetails] = useState({});
  const [landlordDetails, setLandlordDetails] = useState({});
  const [appliances, setAppliances] = useState([]);
  const [isAddingAppliance, setIsAddingAppliance] = useState(false);

  const next = () => setActiveStep((prev) => prev + 1);
  const back = () => setActiveStep((prev) => prev - 1);

  const handleSaveAppliance = (appliance) => {
    setAppliances([...appliances, appliance]);
    setIsAddingAppliance(false);
    setActiveStep(2); // Go back to appliance list
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <Step key={index}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {/* Step 0: Tenant Info */}
        {activeStep === 0 && (
          <TenantDetailsStep
            data={tenantDetails}
            onNext={(data) => { setTenantDetails(data); next(); }}
          />
        )}

        {/* Step 1: Landlord Info */}
        {activeStep === 1 && (
          <LandlordDetailsStep
            data={landlordDetails}
            onNext={(data) => { setLandlordDetails(data); next(); }}
            onBack={back}
          />
        )}

        {/* Step 2: Appliance List */}
        {activeStep === 2 && !isAddingAppliance && (
          <ApplianceListStep
            appliances={appliances}
            onAddAppliance={() => setIsAddingAppliance(true)}
            onBack={back}
            onNext={next} // continue to next form section
          />
        )}

        {/* Step 3: Add Appliance Wizard */}
        {activeStep === 2 && isAddingAppliance && (
          <AddApplianceStepper
            onSaveAppliance={handleSaveAppliance}
            onCancel={() => setIsAddingAppliance(false)}
          />
        )}
      </Paper>
    </Box>
  );
};

export default GasSafetyWizard;
