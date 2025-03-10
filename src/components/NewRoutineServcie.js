import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import { AuthContext } from "./AuthContext";


const NewRoutineService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Define steps for the Stepper
  const steps = ["Service Questions", "Next Service Due Date", "Your Details"];

  // Default next service due date: 1 year from now
  const defaultDueDate = new Date();
  defaultDueDate.setFullYear(defaultDueDate.getFullYear() + 1);
  const defaultDueDateStr = defaultDueDate.toISOString().split("T")[0];

  // Form state for Part 1: Routine Service Questions
  const questions = [
    "Condense checked?",
    "Flame Picture",
    "Correct clearances",
    "Ventilation",
    "Gas pipework visual condition",
    "Gas tightness test",
    "Burner/combustion chamber checked and cleaned?",
    "Boiler case seals?",
    "Visual condition of boiler",
    "Electrodes checked",
    "Spillage and flue flow",
    "Flue integrity",
    "Gas analyst readings",
    "Is the gas appliance safe?",
    "Have all checks met manufacturers instructions?"
  ];
  const [responses, setResponses] = useState({});
  const [commentVisibility, setCommentVisibility] = useState({});
  const [commentText, setCommentText] = useState({});

  const handleResponseChange = (questionIndex, newValue) => {
    if (newValue !== null) {
      setResponses(prev => ({ ...prev, [questionIndex]: newValue }));
    }
  };
  const toggleCommentVisibility = (index) => {
    setCommentVisibility(prev => ({ ...prev, [index]: !prev[index] }));
  };
  const handleCommentChange = (index, value) => {
    setCommentText(prev => ({ ...prev, [index]: value }));
  };

  // Form state for Part 2: Next Service Due Date
  const [nextServiceDueDate, setNextServiceDueDate] = useState(defaultDueDateStr);

  // Form state for Part 3: User Details
  const [details, setDetails] = useState({
    firstName: user ? user.FirstName : "",
    lastName: user ? user.LastName : "",
    email: user ? user.Email : "",
    phone: user ? user.Phone : "",
    showDetails: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // Also capture qrCode from navigation state if available
  const qrCode = (location.state && location.state.qrCode) || "";

  // Multi-step navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to control the Cancel confirmation modal
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const validateStep = () => {
    // (Optional) Implement validation logic per step.
    return true;
  };

  const resetForm = () => {
    // Reset all form state to initial values.
    setResponses({});
    setCommentVisibility({});
    setCommentText({});
    setNextServiceDueDate(defaultDueDateStr);
    setDetails({
      firstName: user ? user.FirstName : "",
      lastName: user ? user.LastName : "",
      email: user ? user.Email : "",
      phone: user ? user.Phone : "",
      showDetails: false,
    });
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Build payload, including routine responses and comments as JSON strings
    const payload = {
      qrCode: location.state.qrCode,
      routineServiceResponses: JSON.stringify(responses),
      routineServiceComments: JSON.stringify(commentText),
      nextServiceDueDate, // from your state in Part 2
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone,
      showDetails: details.showDetails,
    };
    try {
      const API_URL = `${config.apiUrl}/newRoutineService?code=${config.key}`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }
      console.log("Routine service recorded:", data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting routine service:", error);
      alert(error.message);
    }
    setIsSubmitting(false);
  };
  

  const handleCancelYes = () => {
    resetForm();
    setOpenCancelModal(false);
    navigate(`/boilerDashboard/${qrCode}`);
  };

  const handleCancelNo = () => {
    setOpenCancelModal(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {questions.map((question, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}>
                    {question}
                  </Box>
                  <IconButton onClick={() => toggleCommentVisibility(index)} size="small">
                    <CommentIcon />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <ToggleButtonGroup
                    value={responses[index] || null}
                    exclusive
                    onChange={(e, newValue) => handleResponseChange(index, newValue)}
                    aria-label={`Response options for question ${index + 1}`}
                  >
                    <ToggleButton
                      value="N/A"
                      sx={{
                        "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                        "&.Mui-selected:hover": { backgroundColor: "#1A2238" },
                      }}
                    >
                      N/A
                    </ToggleButton>
                    <ToggleButton
                      value="PASS"
                      sx={{
                        "&.Mui-selected": { backgroundColor: "green", color: "#fff" },
                        "&.Mui-selected:hover": { backgroundColor: "green" },
                      }}
                    >
                      PASS
                    </ToggleButton>
                    <ToggleButton
                      value="FAIL"
                      sx={{
                        "&.Mui-selected": { backgroundColor: "red", color: "#fff" },
                        "&.Mui-selected:hover": { backgroundColor: "red" },
                      }}
                    >
                      FAIL
                    </ToggleButton>
                    <ToggleButton
                      value="YES"
                      sx={{
                        "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                        "&.Mui-selected:hover": { backgroundColor: "#1A2238" },
                      }}
                    >
                      YES
                    </ToggleButton>
                    <ToggleButton
                      value="NO"
                      sx={{
                        "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                        "&.Mui-selected:hover": { backgroundColor: "#1A2238" },
                      }}
                    >
                      NO
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {commentVisibility[index] && (
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    label="Add Comment"
                    variant="outlined"
                    value={commentText[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    margin="normal"
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
                {index < questions.length - 1 && (
                  <Divider sx={{ my: 2, backgroundColor: "#ccc" }} />
                )}
              </Box>
            ))}
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              label="Next Service Due Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={nextServiceDueDate}
              onChange={(e) => setNextServiceDueDate(e.target.value)}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name"
                multiline
                fullWidth
                size="small"
                margin="normal"
                value={details.firstName}
                onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                multiline
                fullWidth
                size="small"
                margin="normal"
                value={details.lastName}
                onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
              />
            </Box>
            <TextField
              label="Email"
              multiline
              fullWidth
              size="small"
              margin="normal"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
            />
            <TextField
              label="Phone"
              multiline
              fullWidth
              size="small"
              margin="normal"
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={details.showDetails}
                    onChange={(e) =>
                      setDetails({ ...details, showDetails: e.target.checked })
                    }
                  />
                }
                label="I agree to show my details on this service"
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
            <h2>Routine service logged! 🎉</h2>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1A2238",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1A2238" },
                }}
                onClick={() => navigate(`/boilerDashboard/${qrCode}`)}
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
    "&:hover": {
      backgroundColor: "transparent",
    },
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#1A2238",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1A2238" },
                }}
              >
                Submit Routine Service
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Cancel Confirmation Modal */}
      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Cancel Routine Service?</DialogTitle>
        <DialogContent>
          Are you sure? All data will be removed.
        </DialogContent>
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
            variant="outlined"
            sx={{
              borderColor: "#1A2238",
              color: "#1A2238",
              "&:hover": {
                borderColor: "#1A2238",
                backgroundColor: "rgba(26,34,56,0.1)",
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewRoutineService;
