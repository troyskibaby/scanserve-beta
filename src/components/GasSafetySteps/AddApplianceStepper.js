import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Typography, Paper } from '@mui/material';
import ApplianceDetailsForm from './ApplianceDetailsForm';
import InspectionDetailsForm from './InspectionDetailsForm';
import FlueTestForm from './FlueTestForm';
import ResultsForm from './ResultsForm';

const AddApplianceStepper = ({ onSaveAppliance, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [applianceData, setApplianceData] = useState({
    location: '',
    make: '',
    model: '',
    type: '',
    flueType: '',
    // Inspection
    operatingPressure: '',
    heatInput: '',
    safetyDeviceWorks: '',
    ventilationAdequate: '',
    coAlarmFitted: '',
    coAlarmTested: '',
    // Flue
    flueFlowTest: '',
    spillageTest: '',
    terminationSatisfactory: '',
    visualCondition: '',
    coReading: '',
    co2Reading: '',
    ratio: '',
    // Results
    applianceSafeToUse: '',
    landlordsAppliance: '',
    inspected: '',
  });

  const steps = ['Appliance Details', 'Inspection Details', 'Flue Test', 'Results'];

  const updateFields = (newData) => {
    setApplianceData(prev => ({ ...prev, ...newData }));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSave = (finalData) => {
    onSaveAppliance({ ...applianceData, ...finalData });
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Add Appliance</Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label, i) => (
            <Step key={i}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <ApplianceDetailsForm data={applianceData} onNext={updateFields} onCancel={onCancel} />
        )}
        {activeStep === 1 && (
          <InspectionDetailsForm data={applianceData} onNext={updateFields} onBack={handleBack} />
        )}
        {activeStep === 2 && (
          <FlueTestForm data={applianceData} onNext={updateFields} onBack={handleBack} />
        )}
        {activeStep === 3 && (
          <ResultsForm data={applianceData} onNext={handleSave} onBack={handleBack} />
        )}
      </Paper>
    </Box>
  );
};

export default AddApplianceStepper;
