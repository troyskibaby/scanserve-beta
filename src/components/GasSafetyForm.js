import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import ApplianceStep from "./steps/ApplianceStep";
import InspectionStep from "./steps/InspectionStep";
import FlueTestStep from "./steps/FlueTestStep";
import ResultsStep from "./steps/ResultsStep";
import FinalChecksStep from "./steps/FinalCheckStep";
import SummaryStep from "./steps/SummaryStep";

const GasSafetyForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [appliances, setAppliances] = useState([]);
  const [currentAppliance, setCurrentAppliance] = useState({});


  const steps = [
    "Appliance Details",
    "Inspection Details",
    "Flue Test",
    "Results",
    "Final Checks",
    "Summary"
  ];

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const saveCurrentAppliance = () => {
    setAppliances([...appliances, currentAppliance]);
    setCurrentAppliance({});
    setActiveStep(0); // back to Appliance Step to start next appliance
  };

  const handleCompleteForm = (details) => {
    setFinalDetails(details);
    setAllCompleted(true);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <ApplianceStep
            data={currentAppliance}
            setData={setCurrentAppliance}
            nextStep={nextStep}
          />
        )}
        {activeStep === 1 && (
          <InspectionStep
            data={currentAppliance}
            setData={setCurrentAppliance}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 2 && (
          <FlueTestStep
            data={currentAppliance}
            setData={setCurrentAppliance}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 3 && (
          <ResultsStep
            data={currentAppliance}
            setData={setCurrentAppliance}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 4 && (
          <FinalChecksStep
            saveAppliance={saveCurrentAppliance}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {activeStep === 5 && (
          <SummaryStep
            appliances={appliances}
            onComplete={handleCompleteForm}
            prevStep={prevStep}
          />
        )}
      </Box>
    </Box>
  );
};

export default GasSafetyForm;
