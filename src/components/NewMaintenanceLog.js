// NewMaintenanceLog.js
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AuthContext } from "./AuthContext";
import config from "../config";


const NewMaintenanceLog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Define steps for the Stepper
  const steps = ["Activity Description", "Activity Date", "Your Details"];

  // Form data state
  const [formData, setFormData] = useState({
    activityDescription: "",
    workshopDescription: "",
    partsReplaced: "", // "Yes" or "No"
    replacedPartsDescription: "",
    activityDate: "",
    firstName: user ? user.FirstName : "",
    lastName: user ? user.LastName : "",
    email: user ? user.Email : "",
    phone: user ? user.Phone : "",
    showDetails: false,
    qrCode: (location.state && location.state.qrCode) || "",
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Cancel Modal State
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const validateStep = () => {
    // (Optional) Add per-step validation here
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = `${config.apiUrl}/newMaintenanceActivity?code=${config.key}`;
          

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }
      console.log("Maintenance activity created:", data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting maintenance log:", error);
      alert(error.message);
    }
    setIsSubmitting(false);
  };

  // Cancel modal handlers (defined inside so they have access to state)
  const handleCancelYes = () => {
    // Reset form state if desired (here we simply navigate away)
    setOpenCancelModal(false);
    navigate(`/boilerDashboard/${formData.qrCode}`);
  };

  const handleCancelNo = () => {
    setOpenCancelModal(false);
  };

  // Render form content based on current step.
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Description of work"
              multiline
              fullWidth
              margin="normal"
              value={formData.workshopDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workshopDescription: e.target.value,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                },
                "& .MuiFormLabel-root": { color: "#bbb" },
                "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
              }}
            />
            <Box sx={{ mt: 2, mb: 1, textAlign: "left" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Did you replace any parts as part of this work?
              </div>
              <Button
                variant={formData.partsReplaced === "Yes" ? "contained" : "outlined"}
                sx={{
                  mr: 1,
                  borderColor: "#1A2238",
                  backgroundColor:
                    formData.partsReplaced === "Yes" ? "#FF6A3d" : undefined,
                  color: formData.partsReplaced === "Yes" ? "#fff" : "#1A2238",
                  "&:hover": {
                    backgroundColor:
                      formData.partsReplaced === "Yes"
                        ? "#FF6A3d"
                        : "rgba(26,34,56,0.1)",
                  },
                }}
                onClick={() =>
                  setFormData({ ...formData, partsReplaced: "Yes" })
                }
              >
                Yes
              </Button>
              <Button
                variant={formData.partsReplaced === "No" ? "contained" : "outlined"}
                sx={{
                  borderColor: "#1A2238",
                  backgroundColor:
                    formData.partsReplaced === "No" ? "#FF6A3d" : undefined,
                  color: formData.partsReplaced === "No" ? "#fff" : "#1A2238",
                  "&:hover": {
                    backgroundColor:
                      formData.partsReplaced === "No"
                        ? "#FF6A3d"
                        : "rgba(26,34,56,0.1)",
                  },
                }}
                onClick={() =>
                  setFormData({ ...formData, partsReplaced: "No" })
                }
              >
                No
              </Button>
            </Box>
            {formData.partsReplaced === "Yes" && (
              <TextField
                label="Description of replaced parts"
                multiline
                fullWidth
                margin="normal"
                value={formData.replacedPartsDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    replacedPartsDescription: e.target.value,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#ccc" },
                    "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                  },
                  "& .MuiFormLabel-root": { color: "#bbb" },
                  "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
                }}
              />
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              label="Date of activity"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.activityDate}
              onChange={(e) =>
                setFormData({ ...formData, activityDate: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                },
                "& .MuiFormLabel-root": { color: "#bbb" },
                "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                size="small"
                margin="normal"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#ccc" },
                    "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                  },
                  "& .MuiFormLabel-root": { color: "#bbb" },
                  "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
                }}
              />
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                margin="normal"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#ccc" },
                    "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                  },
                  "& .MuiFormLabel-root": { color: "#bbb" },
                  "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
                }}
              />
            </Box>
            <TextField
              label="Email"
              fullWidth
              size="small"
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                },
                "& .MuiFormLabel-root": { color: "#bbb" },
                "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
              }}
            />
            <TextField
              label="Phone"
              fullWidth
              size="small"
              margin="normal"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#1A2238" },
                },
                "& .MuiFormLabel-root": { color: "#bbb" },
                "& .MuiFormLabel-root.Mui-focused": { color: "#1A2238" },
              }}
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.showDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, showDetails: e.target.checked })
                    }
                  />
                }
                label="I agree to show my details on this maintenance activity"
              />
            </Box>
          </Box>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  if (submitted) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#fff" }} elevation={3}>
          <h2>Maintenance activity logged! 🎉</h2>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1A2238",
                color: "#fff",
                "&:hover": { backgroundColor: "#1A2238" },
              }}
              onClick={() => navigate(`/boilerDashboard/${formData.qrCode}`)}
            >
              Back to Boiler Dashboard
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1A2238",
                color: "#1A2238",
                "&:hover": {
                  borderColor: "#1A2238",
                  backgroundColor: "rgba(26,34,56,0.1)",
                },
              }}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <div className="step-container" style={{ padding: "20px" }}>
      <Paper sx={{ p: 3, maxWidth: 600, margin: "auto", backgroundColor: "#fff" }} elevation={3}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>{renderStepContent(currentStep)}</Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {currentStep > 0 && (
            <Button
              variant="outlined"
              onClick={prevStep}
              sx={{
                borderColor: "#1A2238",
                color: "#1A2238",
                "&:hover": {
                  borderColor: "#1A2238",
                  backgroundColor: "rgba(26,34,56,0.1)",
                },
              }}
            >
              Back
            </Button>
          )}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="text"
              onClick={() => setOpenCancelModal(true)}
              sx={{
                textDecoration: "underline",
                color: "#1A2238",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Cancel
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={nextStep}
                sx={{
                  backgroundColor: "#1A2238",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1A2238" },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit();
                  setSubmitted(true);
                }}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#1A2238",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1A2238" },
                }}
              >
                Submit Maintenance Log
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Cancel Confirmation Modal */}
      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Cancel Maintenance Log?</DialogTitle>
        <DialogContent>Are you sure? All data will be removed.</DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelYes}
            variant="contained"
            sx={{
              backgroundColor: "#1A2238",
              color: "#fff",
              "&:hover": { backgroundColor: "#1A2238" },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={handleCancelNo}
            variant="text"
            sx={{
              textDecoration: "underline",
              color: "#1A2238",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewMaintenanceLog;
