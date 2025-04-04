import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stepper, Step, StepLabel, Checkbox, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Typography, Box
} from '@mui/material';
import config from '../config';

// Step 1: Unique Code Input
const StepUniqueCode = ({ formData, setFormData, nextStep, errors, setErrors }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, uniqueCode: e.target.value });
  };

  const handleNext = async () => {
    if (!formData.uniqueCode.trim()) {
      setErrors({ ...errors, uniqueCode: "Unique code is required" });
      return;
    }
    setErrors({ ...errors, uniqueCode: null });
    setIsValidating(true);
    setValidationMessage('');

    try {
      const API_URL = `${config.apiUrl}/validateCode?code=${config.key}`; // update with your actual endpoint
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: formData.uniqueCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Code is valid
        setValidationMessage('✅ Code is valid');
        // Wait 1 second then move to the next step
        setTimeout(() => {
          nextStep();
        }, 1000);
      } else {
        if (response.status === 409) {
          // Code already registered: show the API error message.
          setValidationMessage(
            <>
              ❌ {data.message}{' '}
              <a href="https://www.scanserve.co.uk" target="_blank" rel="noopener noreferrer">
                Our Store
              </a>
            </>
          );
        } else {
          // Other errors: show a generic message.
          setValidationMessage(
            <>
              ❌ Invalid code, visit our store to purchase{' '}
              <a href="https://www.scanserve.co.uk" target="_blank" rel="noopener noreferrer">
                Our Store
              </a>
            </>
          );
        }
      }
    } catch (error) {
      console.error('Error validating code:', error);
      setValidationMessage(
        <>
          ❌ Invalid code, visit our store to purchase{' '}
          <a href="https://www.scanserve.co.uk" target="_blank" rel="noopener noreferrer">
            Our Store
          </a>
        </>
      );
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div>
      <h3>Enter Unique Code</h3>
      <p>Or scan QR code (scanner integration coming soon)</p>
      <div className="form-field">
        <input
          type="text"
          placeholder="Enter Unique Code"
          value={formData.uniqueCode}
          onChange={handleChange}
          className={`input ${errors.uniqueCode ? "error" : ""}`}
          id="uniqueCode"
        />
        {errors.uniqueCode && <p className="error-message">{errors.uniqueCode}</p>}
      </div>
      <div className="step-buttons">
        <button className="primary-button" onClick={handleNext} disabled={isValidating}>
          {isValidating ? 'Validating code...' : 'Next'}
        </button>
      </div>
      {validationMessage && (
        <div className="validation-message" style={{ marginTop: '10px' }}>
          {validationMessage}
        </div>
      )}
    </div>
  );
};

// Step 2: Boiler Details Input (without installation date)
const StepBoilerDetails = ({
  formData,
  setFormData,
  prevStep,
  nextStep,
  errors,
  setErrors,
}) => {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Validate the Make and Type fields before proceeding
  const handleNext = () => {
    let hasError = false;
    // Validate Make field
    if (!formData.make.trim()) {
      setErrors((prev) => ({ ...prev, make: "Make is required" }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, make: null }));
    }
    // Validate Type field
    if (!formData.type) {
      setErrors((prev) => ({ ...prev, type: "Type is required" }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, type: null }));
    }
    if (!hasError) {
      nextStep();
    }
  };

  return (
    <div>
      <h3>Boiler Details</h3>
      <div className="form-field-inline">
        <label htmlFor="make">
          * Make:
          <input
            type="text"
            id="make"
            value={formData.make}
            onChange={(e) => handleChange("make", e.target.value)}
            required
            className={`input ${errors.make ? "error" : ""}`}
          />
          {errors.make && <p className="error-message">{errors.make}</p>}
        </label>
        <label htmlFor="model">
          Model:
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            required
            className={`input ${errors.model ? "error" : ""}`}
          />
          {errors.model && <p className="error-message">{errors.model}</p>}
        </label>
      </div>
      <div className="form-field">
        <label htmlFor="serialNumber">
          Serial Number:
          <input
            type="text"
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => handleChange("serialNumber", e.target.value)}
            required
            className="input"
          />
        </label>
      </div>
      <div className="form-field">
        <label
          htmlFor="type"
          style={{
            display: 'block',
            marginBottom: '4px',
            whiteSpace: 'normal',
            overflow: 'visible'
          }}
        >
          * Type:
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          required
          className={`input ${errors.type ? "error" : ""}`}
        >
          <option value="">Select Type</option>
          <option value="Gas">Gas</option>
          <option value="Oil">Oil</option>
          <option value="Heat Pump">Heat Pump</option>
          <option value="Other">Other</option>
        </select>
        {errors.type && <p id="type-error-message" className="error-message">{errors.type}</p>}
      </div>
      {formData.type === "Gas" && (
        <div className="form-field">
          <label htmlFor="gcNumber">
            GC Number:
            <input
              type="text"
              id="gcNumber"
              value={formData.gcNumber}
              onChange={(e) => handleChange("gcNumber", e.target.value)}
              required
              className="input"
            />
          </label>
        </div>
      )}
      {formData.type === "Oil" && (
  <>
    <h4 style={{ marginTop: '20px' }}>Burner Details</h4>

    <div className="form-field">
      <label htmlFor="codNumber">
        CoD Number:
        <input
          type="text"
          id="codNumber"
          value={formData.codNumber}
          onChange={(e) => handleChange("codNumber", e.target.value)}
          className="input"
        />
      </label>
    </div>

    <div className="form-field-inline" style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: 1 }}>
    <label htmlFor="nozzleSize">
      Nozzle Size (gal/hr):
      <input
        type="number"
        id="nozzleSize"
        step="0.01"
        value={formData.nozzleSize}
        onChange={(e) => handleChange("nozzleSize", e.target.value)}
        className="input"
        style={{ width: '100%' }}
      />
    </label>
  </div>

  <div style={{ flex: 1 }}>
    <label htmlFor="sprayPattern">
      Spray Pattern:
      <input
        type="text"
        id="sprayPattern"
        value={formData.sprayPattern}
        onChange={(e) => handleChange("sprayPattern", e.target.value)}
        className="input"
        style={{ width: '100%' }}
      />
    </label>
  </div>
</div>


    <div className="form-field">
      <label htmlFor="sprayAngle">
        Spray Angle (0–360°):
        <input
          type="number"
          id="sprayAngle"
          min="0"
          max="360"
          value={formData.sprayAngle}
          onChange={(e) => handleChange("sprayAngle", e.target.value)}
          className="input"
        />
      </label>
    </div>
  </>
)}

      {formData.type === "Other" && (
        <div className="form-field">
          <label htmlFor="otherType">
            Please specify:
            <input
              type="text"
              id="otherType"
              value={formData.otherType}
              onChange={(e) => handleChange("otherType", e.target.value)}
              required
              className="input"
            />
          </label>
        </div>
      )}
      <div className="step-buttons">
        <button onClick={prevStep} className="secondary-button">
          Previous
        </button>
        <button onClick={handleNext} className="primary-button">
          Next
        </button>
      </div>
    </div>
  );
};

// Step 3: Boiler Install Details (Date Installed)
const StepBoilerInstallDetails = ({ formData, setFormData, prevStep, nextStep }) => {
  const handleCheckboxChange = (event) => {
    const newChecked = event.target.checked;
    // Update unknownDate and clear the dateInstalled if checkbox is checked
    setFormData((prev) => ({
      ...prev,
      unknownDate: newChecked,
      dateInstalled: newChecked ? '' : prev.dateInstalled,
    }));
  };

  const handleDateChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      dateInstalled: event.target.value,
    }));
  };

  return (
    <div>
      <h3>Boiler Install Details</h3>
      <div className="form-field">
        <label htmlFor="dateInstalled">
          Date Installed:
          <input
            type="date"
            id="dateInstalled"
            value={formData.dateInstalled}
            onChange={handleDateChange}
            disabled={formData.unknownDate}
            required={!formData.unknownDate}
            className="input"
            style={{ display: 'block', padding: '8px', width: '100%', marginTop: '5px' }}
          />
        </label>
      </div>
      <div className="form-field">
        <FormControlLabel
          control={
            <Checkbox
              id="unknownDate"
              checked={formData.unknownDate}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label="I don't know the installation date"
        />
      </div>
      <div className="step-buttons">
        <button onClick={prevStep} className="secondary-button">
          Previous
        </button>
        <button onClick={nextStep} className="primary-button">
          Next
        </button>
      </div>
    </div>
  );
};

// Step 4: Location Details (UK Address)
const StepLocationDetails = ({
  formData,
  setFormData,
  prevStep,
  submitForm,
  errors,
  setErrors,
  isSubmitting,
}) => {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Validation function for location details
  const validate = () => {
    let isValid = true;

    // Validate Address Line 1
    if (!formData.addressLine1.trim()) {
      setErrors((prev) => ({ ...prev, addressLine1: "Address Line 1 is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, addressLine1: null }));
    }

    // Validate Postcode
    if (!formData.postcode.trim()) {
      setErrors((prev) => ({ ...prev, postcode: "Postcode is required" }));
      isValid = false;
    } else {
      // UK postcode regex: allows formats like "SW1A 1AA", "EC1A 1BB", etc.
      const ukPostcodeRegex = /^(GIR\s?0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})$/i;
      if (!ukPostcodeRegex.test(formData.postcode)) {
        setErrors((prev) => ({ ...prev, postcode: "Invalid UK postcode format" }));
        isValid = false;
      } else {
        setErrors((prev) => ({ ...prev, postcode: null }));
      }
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      submitForm();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Location Details</h3>
      <div className="form-field">
        <label htmlFor="addressLine1">* Address Line 1:</label>
        <input
          type="text"
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          className={`input ${errors.addressLine1 ? "error" : ""}`}
        />
        {errors.addressLine1 && <p className="error-message">{errors.addressLine1}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="addressLine2">Address Line 2:</label>
        <input
          type="text"
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          className="input"
        />
      </div>
      <div className="form-field-inline">
        <label htmlFor="city">
          City/Town:
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="input"
          />
        </label>
        <label htmlFor="county">
          County:
          <input
            type="text"
            id="county"
            value={formData.county}
            onChange={(e) => handleChange("county", e.target.value)}
            className="input"
          />
        </label>
      </div>
      <div className="form-field">
        <label htmlFor="postcode">* Postcode:</label>
        <input
          type="text"
          id="postcode"
          value={formData.postcode}
          onChange={(e) => handleChange("postcode", e.target.value)}
          className={`input ${errors.postcode ? "error" : ""}`}
        />
        {errors.postcode && <p className="error-message">{errors.postcode}</p>}
      </div>
      <div className="step-buttons">
        <button onClick={prevStep} type="button" className="secondary-button">
          Previous
        </button>
        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? "Registering boiler..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

const RegisterBoiler = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uniqueCode: qrCode || '',
    make: '',
    model: '',
    serialNumber: '',
    type: '',
    gcNumber: '',
    otherType: '',
    codNumber: '',
    nozzleSize: '',
    sprayPattern: '',
    sprayAngle: '',
    dateInstalled: '',
    unknownDate: false,
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const steps = ['Unique Code', 'Boiler Details', 'Boiler Install Details', 'Location Details'];

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleFinalSubmit = () => {
    setConfirmOpen(false);
    setShowSpinner(true);
    setTimeout(() => {
      submitForm();
    }, 2000);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = `${config.apiUrl}/registerBolier?code=${config.key}`;
      const payload = {
        qrCode: formData.uniqueCode,
        make: formData.make,
        model: formData.model,
        installDate: formData.unknownDate ? null : formData.dateInstalled,
        serialNumber: formData.serialNumber,
        type: formData.type,
        gcNumber: formData.gcNumber,
        codNumber: formData.codNumber || null,
        otherType: formData.otherType,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        postalCode: formData.postcode,
        nozzleSize: formData.type === "Oil" ? parseFloat(formData.nozzleSize) || null : null,
        sprayPattern: formData.type === "Oil" ? formData.sprayPattern || null : null,
        sprayAngle: formData.type === "Oil" ? parseInt(formData.sprayAngle) || null : null,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        navigate('/registration-result', { state: { success: false, message: data.message || "Registration failed." } });
      } else {
        navigate('/boiler-link-confirmation', { state: { boilerID: data.boilerID, isLoggedIn: data.isLoggedIn } });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      navigate('/registration-result', { state: { success: false, message: "An unexpected error occurred." } });
    } finally {
      setIsSubmitting(false);
      setShowSpinner(false);
    }
  };

  return (
    <div className="step-container">
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {currentStep === 0 && (
        <StepUniqueCode
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {currentStep === 1 && (
        <StepBoilerDetails
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          nextStep={nextStep}
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {currentStep === 2 && (
        <StepBoilerInstallDetails
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}
      {currentStep === 3 && (
        <StepLocationDetails
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          submitForm={() => setConfirmOpen(true)}
          errors={errors}
          setErrors={setErrors}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Registration</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to register a <strong>{formData.make}</strong> boiler at <strong>{formData.addressLine1}</strong>.<br />
            Once submitted, details may not be able to be changed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Go back to registration
          </Button>
          <Button onClick={handleFinalSubmit} variant="contained" color="primary">
            Complete Registration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Spinner Overlay */}
      {showSpinner && (
        <Box sx={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', zIndex: 1300,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <CircularProgress sx={{ color: "#FF6A3d" }} />
          <Typography sx={{ mt: 2, color: '#FF6A3d', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Registering Boiler...
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default RegisterBoiler;