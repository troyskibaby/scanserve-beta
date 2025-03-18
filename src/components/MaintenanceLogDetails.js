import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@mui/material";
import config from "../config";

function TabPanel({ children, value, index, ...other }) {
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

const MaintenanceLogDetails = () => {
  const { maintenanceID } = useParams(); // or use qrCode if that’s your identifier
  const navigate = useNavigate();
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        const API_URL = `${config.apiUrl}/getMaintenanceServiceDetails?code=${config.key}&maintenanceID=${maintenanceID}`;
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load maintenance log details.");
        } else {
          setLogData(data.maintenanceLog); // adjust based on your API
        }
      } catch (err) {
        setError("An error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogDetails();
  }, [maintenanceID]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!logData) return <div>No details available.</div>;

  // Normalize the log data (adjust keys as needed)
  const transformedDetails = {
    activityDescription: logData.activityDescription || logData.ActivityDescription || "",
    workshopDescription: logData.workshopDescription || logData.WorkshopDescription || "",
    partsReplaced: logData.partsReplaced || logData.PartsReplaced || "",
    replacedPartsDescription: logData.replacedPartsDescription || logData.ReplacedPartsDescription || "",
    activityDate: logData.activityDate || logData.ActivityDate || "",
    firstName: logData.firstName || logData.FirstName || "",
    lastName: logData.lastName || logData.LastName || "",
    email: logData.email || logData.Email || "",
    phone: logData.phone || logData.Phone || "",
    showDetails: logData.showDetails || logData.ShowDetails || false,
  };

  // Format the date if needed:
  const formattedActivityDate = transformedDetails.activityDate
    ? new Date(transformedDetails.activityDate).toISOString().split("T")[0]
    : "";

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Paper sx={{ p: 3, maxWidth: 600, margin: "auto" }} elevation={3}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Activity Description" />
          <Tab label="Activity Date" />
          <Tab label="Your Details" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <TextField
            label="Workshop Description"
            fullWidth
            multiline
            margin="normal"
            value={transformedDetails.workshopDescription}
            InputProps={{ readOnly: true }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Parts Replaced: {transformedDetails.partsReplaced}</Typography>
          {transformedDetails.partsReplaced === "Yes" && (
            <TextField
              label="Replaced Parts Description"
              fullWidth
              multiline
              margin="normal"
              value={transformedDetails.replacedPartsDescription}
              InputProps={{ readOnly: true }}
            />
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <TextField
            label="Activity Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formattedActivityDate}
            InputProps={{ readOnly: true }}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <TextField
            label="First Name"
            multiline
            fullWidth
            margin="normal"
            value={transformedDetails.firstName}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Last Name"
            multiline
            fullWidth
            margin="normal"
            value={transformedDetails.lastName}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Email"
            multiline
            fullWidth
            margin="normal"
            value={transformedDetails.email}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Phone"
            multiline
            fullWidth
            margin="normal"
            value={transformedDetails.phone}
            InputProps={{ readOnly: true }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {transformedDetails.showDetails
              ? "User details are visible on this activity."
              : "User details are hidden for this activity."}
          </Typography>
        </TabPanel>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Paper>
      {/* Uncomment for debugging */}
      {/* <pre>{JSON.stringify(transformedDetails, null, 2)}</pre> */}
    </div>
  );
};

export default MaintenanceLogDetails;
