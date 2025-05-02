import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ApplianceStep from "./steps/ApplianceStep";
import InspectionStep from "./steps/InspectionStep";
import FlueTestStep from "./steps/FlueTestStep";
import ResultsStep from "./steps/ResultsStep";
import FinalCheckStep from "./steps/FinalCheckStep";
import SummaryStep from "./steps/SummaryStep";

const steps = [
  "Appliance Details",
  "Inspection",
  "Flue Test",
  "Results",
  "Final Checks",
  "Summary"
];

const GasSafetyFormWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [appliances, setAppliances] = useState([{}]); // Start with a single appliance object
  const location = useLocation();
  const qrCode = location.state?.qrCode;
 

  const handleNext = (stepData) => {
    const updated = [...appliances];
    const current = updated[0] || {}; // Merge data into first appliance
    updated[0] = { ...current, ...stepData };
    setAppliances(updated);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = (finalData) => {
    console.log("Record completed:", finalData);
  };

  const stepProps = {
    appliances,
    setAppliances,
    onNext: handleNext,
    prevStep: handleBack,
    onComplete: handleComplete
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Landlord Gas Safety Record
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && <ApplianceStep {...stepProps} />}
      {activeStep === 1 && <InspectionStep {...stepProps} />}
      {activeStep === 2 && <FlueTestStep {...stepProps} />}
      {activeStep === 3 && <ResultsStep {...stepProps} />}
      {activeStep === 4 && <FinalCheckStep {...stepProps} />}
      {activeStep === 5 && (
        <SummaryStep
          {...stepProps}
          boilerID={qrCode}
          userID={1} // replace with real user ID from context if needed
        />
      )}

      {activeStep > 5 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Record complete ✅
        </Typography>
      )}
    </Box>
  );
};

export default GasSafetyFormWizard;
