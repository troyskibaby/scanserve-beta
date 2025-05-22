import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

import TenantDetailsStep from './GasSafetySteps/TenantDetailsStep';
import LandlordDetailsStep from './GasSafetySteps/LandlordDetailsStep';
import ApplianceListStep from './GasSafetySteps/ApplianceListStep';
import AddApplianceStepper from './GasSafetySteps/AddApplianceStepper';

const steps = ['Tenant Info', 'Landlord Info', 'Appliances', 'Add Appliance'];

const GasSafetyWizard = () => {
  const location = useLocation();
  const boilerAddress = location.state?.boilerAddress || '';
  const boilerPostcode = location.state?.boilerPostcode || '';

  const [activeStep, setActiveStep] = useState(0);

  const [tenantDetails, setTenantDetails] = useState({
    tenantName: '',
    tenantPresent: '',
    tenantAddress: boilerAddress,
    tenantPostcode: boilerPostcode,
  });

  const [landlordDetails, setLandlordDetails] = useState({
    landlordName: '',
    landlordPresent: '',
    landlordAddress: boilerAddress,
    landlordPostcode: boilerPostcode,
    landlordNotApplicable: false,
  });

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

        {activeStep === 0 && (
          <TenantDetailsStep
            data={tenantDetails}
            onNext={(data) => { setTenantDetails(data); next(); }}
          />
        )}

        {activeStep === 1 && (
          <LandlordDetailsStep
            data={landlordDetails}
            onNext={(data) => { setLandlordDetails(data); next(); }}
            onBack={back}
          />
        )}

        {activeStep === 2 && !isAddingAppliance && (
          <ApplianceListStep
            appliances={appliances}
            onAddAppliance={() => setIsAddingAppliance(true)}
            onBack={back}
            onNext={next}
          />
        )}

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
