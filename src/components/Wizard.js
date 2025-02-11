import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const Wizard = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isLastStep = currentStep === totalSteps;

  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mb-6">
        <CurrentStepComponent />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className={`px-4 py-2 text-sm rounded bg-gray-300 text-gray-800 ${
            currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Wizard;
