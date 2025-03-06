// ViewBoilerDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  CircularProgress,
  Button
} from "@mui/material";
import config from "../config";

// Helper component for tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`boiler-tabpanel-${index}`}
      aria-labelledby={`boiler-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ViewBoilerDetails = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [boiler, setBoiler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchBoilerDetails = async () => {
      try {
        const API_URL = `${config.apiUrl}/getBoilerDetails?code=${config.key}&qrCode=${encodeURIComponent(qrCode)}`;
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load boiler details.");
        } else {
          setBoiler(data.boiler);
        }
      } catch (err) {
        setError("An error occurred while fetching boiler details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoilerDetails();
  }, [qrCode]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "red" }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 2, px: 2 }}>
      <Paper sx={{ p: 2, backgroundColor: "#fff" }} elevation={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#FF6A3d" } }}
        >
          <Tab
            label="Boiler Details"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              border: "1px solid #FF6A3d",
              backgroundColor: tabValue === 0 ? "#FF6A3d" : "#fff",
              color: tabValue === 0 ? "#fff" : "#FF6A3d",
              "&:hover": {
                backgroundColor: tabValue === 0 ? "#FF6A3d" : "rgba(255,106,61,0.1)",
              },
            }}
          />
          <Tab
            label="Location"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              border: "1px solid #FF6A3d",
              backgroundColor: tabValue === 1 ? "#FF6A3d" : "#fff",
              color: tabValue === 1 ? "#fff" : "#FF6A3d",
              "&:hover": {
                backgroundColor: tabValue === 1 ? "#FF6A3d" : "rgba(255,106,61,0.1)",
              },
            }}
          />
          <Tab
            label="Boiler Code"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              border: "1px solid #FF6A3d",
              backgroundColor: tabValue === 2 ? "#FF6A3d" : "#fff",
              color: tabValue === 2 ? "#fff" : "#FF6A3d",
              "&:hover": {
                backgroundColor: tabValue === 2 ? "#FF6A3d" : "rgba(255,106,61,0.1)",
              },
            }}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 1 }}>
            <strong>Make:</strong> {boiler.Make}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Model:</strong> {boiler.Model}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Serial Number:</strong> {boiler.SerialNumber}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Type:</strong> {boiler.Type}
          </Box>
          {boiler.GCNumber && (
            <Box sx={{ mb: 1 }}>
              <strong>GC Number:</strong> {boiler.GCNumber}
            </Box>
          )}
          {boiler.CoDNumber && (
            <Box sx={{ mb: 1 }}>
              <strong>CoD Number:</strong> {boiler.CoDNumber}
            </Box>
          )}
          <Box sx={{ mb: 1 }}>
            <strong>Other Type:</strong> {boiler.OtherType}
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 1 }}>
            <strong>Address Line 1:</strong> {boiler.AddressLine1}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Address Line 2:</strong> {boiler.AddressLine2}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>City:</strong> {boiler.City}
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>Postal Code:</strong> {boiler.PostalCode}
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 1 }}>
            <strong>QRCode:</strong> {boiler.QRCode}
          </Box>
        </TabPanel>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1A2238",
              color: "#fff",
              "&:hover": { backgroundColor: "#1A2238" },
            }}
            onClick={() => navigate(`/boilerDashboard/${boiler.QRCode}`)}
          >
            Back to Boiler Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewBoilerDetails;
