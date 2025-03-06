// RoutineServiceDetails.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Button,
  Box,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { AuthContext } from "./AuthContext";
import config from "../config";

// Helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const RoutineServiceDetails = () => {
  const { recordID } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  // State to control comment visibility per question
  const [commentVisibility, setCommentVisibility] = useState({});

  // Define tab labels
  const steps = ["Service Questions", "Next Service Due Date", "Your Details"];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const API_URL = `${config.apiUrl}/getRoutineServiceDetails?code=${config.key}&recordID=${recordID}`;
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load routine service details.");
        } else {
          setServiceDetails(data.routineService);
        }
      } catch (err) {
        setError("An error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [recordID]);

  if (loading) {
    return <div>Loading details...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  if (!serviceDetails) {
    return <div>No details available.</div>;
  }

  // Normalize property names from the API response.
  // Note: We now include "RoutineResponses" and "RoutineComments".
  const transformedDetails = {
    routineServiceResponses: serviceDetails.routineServiceResponses ||
      serviceDetails.RoutineServiceResponses ||
      serviceDetails.RoutineResponses ||
      "{}",
    routineServiceComments: serviceDetails.routineServiceComments ||
      serviceDetails.RoutineServiceComments ||
      serviceDetails.RoutineComments ||
      "{}",
    rawNextServiceDueDate: serviceDetails.nextServiceDueDate ||
      serviceDetails.NextServiceDueDate ||
      "",
    firstName: serviceDetails.firstName || serviceDetails.FirstName || "",
    lastName: serviceDetails.lastName || serviceDetails.LastName || "",
    email: serviceDetails.email || serviceDetails.Email || "",
    phone: serviceDetails.phone || serviceDetails.Phone || "",
    showDetails: serviceDetails.showDetails || serviceDetails.ShowDetails || false,
  };

  // Format the due date for the date input (YYYY-MM-DD)
  const formattedDueDate = transformedDetails.rawNextServiceDueDate
    ? new Date(transformedDetails.rawNextServiceDueDate).toISOString().split("T")[0]
    : "";

  // Safely parse the JSON strings for responses and comments.
  const responsesStr = (transformedDetails.routineServiceResponses || "").trim();
  const commentTextStr = (transformedDetails.routineServiceComments || "").trim();

  let responses = {};
  let commentText = {};
  try {
    responses = responsesStr.length > 0 ? JSON.parse(responsesStr) : {};
    commentText = commentTextStr.length > 0 ? JSON.parse(commentTextStr) : {};
  } catch (parseError) {
    setError("Error parsing service data.");
  }

  // Questions should match your NewRoutineService form.
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Toggle comment visibility for a specific question index.
  const toggleCommentVisibility = (index) => {
    setCommentVisibility(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderServiceQuestions = () => (
    <Box>
      {questions.map((question, index) => {
        // Force the response value to uppercase (after trimming) for consistency.
        const currentResponse = responses[index]
          ? responses[index].toString().trim().toUpperCase()
          : null;
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {question}
              </Typography>
              <IconButton size="small" onClick={() => toggleCommentVisibility(index)}>
                <CommentIcon />
              </IconButton>
            </Box>
            {/* 
                Using pointerEvents:"none" to mimic a read-only state
                so that the selected ToggleButton shows its color.
            */}
            <ToggleButtonGroup
              value={currentResponse}
              exclusive
              aria-label={`Response options for question ${index + 1}`}
              sx={{ pointerEvents: "none" }}
            >
              <ToggleButton
                value="N/A"
                sx={{
                  "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                }}
              >
                N/A
              </ToggleButton>
              <ToggleButton
                value="PASS"
                sx={{
                  "&.Mui-selected": { backgroundColor: "green", color: "#fff" },
                }}
              >
                PASS
              </ToggleButton>
              <ToggleButton
                value="FAIL"
                sx={{
                  "&.Mui-selected": { backgroundColor: "red", color: "#fff" },
                }}
              >
                FAIL
              </ToggleButton>
              <ToggleButton
                value="YES"
                sx={{
                  "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                }}
              >
                YES
              </ToggleButton>
              <ToggleButton
                value="NO"
                sx={{
                  "&.Mui-selected": { backgroundColor: "#1A2238", color: "#fff" },
                }}
              >
                NO
              </ToggleButton>
            </ToggleButtonGroup>
            {commentVisibility[index] && (
              <TextField
                fullWidth
                margin="normal"
                value={commentText[index] || ""}
                InputProps={{ readOnly: true }}
                multiline
              />
            )}
            {index < questions.length - 1 && (
              <Divider sx={{ my: 2, backgroundColor: "#ccc" }} />
            )}
          </Box>
        );
      })}
    </Box>
  );

  const renderNextServiceDueDate = () => (
    <Box>
      <TextField
        label="Next Service Due Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={formattedDueDate}
        InputProps={{ readOnly: true }}
      />
    </Box>
  );

  const renderUserDetails = () => (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="First Name"
          fullWidth
          size="small"
          margin="normal"
          value={transformedDetails.firstName}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Last Name"
          fullWidth
          size="small"
          margin="normal"
          value={transformedDetails.lastName}
          InputProps={{ readOnly: true }}
        />
      </Box>
      <TextField
        label="Email"
        fullWidth
        size="small"
        margin="normal"
        value={transformedDetails.email}
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Phone"
        fullWidth
        size="small"
        margin="normal"
        value={transformedDetails.phone}
        InputProps={{ readOnly: true }}
      />
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={transformedDetails.showDetails} readOnly />}
          label="I agree to show my details on this service"
        />
      </Box>
    </Box>
  );

  return (
    <div className="step-container" style={{ padding: "20px" }}>
      <Paper sx={{ p: 3, maxWidth: 600, margin: "auto", backgroundColor: "#fff" }} elevation={3}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          {steps.map((label, index) => (
            <Tab key={index} label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
          ))}
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          {renderServiceQuestions()}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {renderNextServiceDueDate()}
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          {renderUserDetails()}
        </TabPanel>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#1A2238",
              color: "#1A2238",
              "&:hover": { borderColor: "#1A2238", backgroundColor: "rgba(26,34,56,0.1)" },
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Paper>
      {/* Optional debug output to inspect parsed JSON */}
      {/*
      <pre>{JSON.stringify({responses, commentText}, null, 2)}</pre>
      */}
    </div>
  );
};

export default RoutineServiceDetails;
