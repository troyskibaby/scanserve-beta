import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  ButtonGroup, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import config from "../config";
import { AuthContext } from "./AuthContext";
import "./Dashboard.css";

const BoilerDashboard = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [boiler, setBoiler] = useState(null);
  const [loadingBoiler, setLoadingBoiler] = useState(true);
  const [error, setError] = useState("");
  
  // Service history state
  const [serviceHistory, setServiceHistory] = useState([]);

  // Linking functionality states
  const [isLinked, setIsLinked] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState("");
  
  // Dialog for unlink confirmation
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Dialog for subscription limit reached alert
  const [maxReachedDialogOpen, setMaxReachedDialogOpen] = useState(false);

  // State for user's linked boilers count from /getUserBoilers
  const [userBoilers, setUserBoilers] = useState([]);

  // Determine max boilers based on subscription plan.
  // For PlanID 4, max = 3; for PlanID 5, max = 10.
  const maxBoilers = user && user.PlanID === 4 ? 3 : user && user.PlanID === 5 ? 10 : 0;
  
  // Fetch boiler details (includes isLinked flag now)
  useEffect(() => {
    if (qrCode) {
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
            setIsLinked(data.boiler.isLinked);
          }
        } catch (err) {
          console.error("Error fetching boiler details:", err);
          setError("An error occurred while fetching boiler details.");
        } finally {
          setLoadingBoiler(false);
        }
      };
      fetchBoilerDetails();
    } else {
      setError("No QR code provided.");
      setLoadingBoiler(false);
    }
  }, [qrCode]);

  // Fetch service history
  useEffect(() => {
    if (qrCode) {
      const fetchServiceHistory = async () => {
        try {
          const API_URL = `${config.apiUrl}/getServiceHistory?code=${config.key}&qrCode=${encodeURIComponent(qrCode)}`;
          const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          });
          const data = await response.json();
          if (!response.ok) {
            console.error("Error fetching service history:", data.message);
          } else {
            setServiceHistory(data.serviceHistory);
          }
        } catch (err) {
          console.error("Error fetching service history:", err);
        }
      };
      fetchServiceHistory();
    }
  }, [qrCode]);

  // Fetch the list of boilers linked to the current user
  useEffect(() => {
    const fetchUserBoilers = async () => {
      try {
        const API_URL = `${config.apiUrl}/getUserBoilers?code=${config.key}`;
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
          setUserBoilers(data.boilers);
        } else {
          console.error("Error fetching user boilers:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user boilers:", error);
      }
    };
    if (user) {
      fetchUserBoilers();
    }
  }, [user]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-GB", options).replace(/,/g, "");
  };

  // Compute days until next service.
  const computeDaysUntilService = () => {
    if (!boiler || !boiler.NextServiceDueDate) return 0;
    const now = new Date();
    const nextService = new Date(boiler.NextServiceDueDate);
    const diffTime = nextService - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Get last routine service date.
  const getLastRoutineServiceDate = () => {
    if (!serviceHistory || serviceHistory.length === 0) return null;
    const lastRoutine = serviceHistory.find(rec => rec.Description === "Routine Service");
    return lastRoutine ? lastRoutine.Date : null;
  };

  // Function to perform link/unlink API call.
  const handleLinkToggle = async () => {
    setLinkError("");
    setLinking(true);
    const endpoint = isLinked ? "/unlinkBoiler" : "/linkBoiler";
    const payload = { boilerID: boiler.BoilerID };

    try {
      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setLinkError(data.message || "Error performing operation.");
      } else {
        // Toggle the linked state on success.
        setIsLinked(!isLinked);
      }
    } catch (err) {
      console.error("Error linking/unlinking boiler:", err);
      setLinkError("An error occurred while processing your request.");
    } finally {
      setLinking(false);
    }
  };

  // Handler for unlink confirmation dialog
  const handleConfirmUnlink = () => {
    setDialogOpen(false);
    handleLinkToggle();
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  // Handlers for subscription limit reached dialog actions.
  const handleUpgrade = () => {
    setMaxReachedDialogOpen(false);
    navigate("/upgrade");
  };

  const handleManageBoilers = () => {
    setMaxReachedDialogOpen(false);
    navigate("/allBoilers");
  };

  // Function to handle the main button click.
  const handleButtonClick = () => {
    if (isLinked) {
      // If the boiler is already linked, show confirmation to unlink.
      setDialogOpen(true);
    } else {
      // For linking, check if the user has reached their subscription limit.
      if (userBoilers.length >= maxBoilers) {
        setMaxReachedDialogOpen(true);
      } else {
        handleLinkToggle();
      }
    }
  };

  if (loadingBoiler) return <div>Loading boiler details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Compute values for visualizations.
  const daysUntilService = computeDaysUntilService();
  const gaugeMax = 365;
  const gaugeValue = daysUntilService > gaugeMax ? gaugeMax : daysUntilService;
  const lastRoutineDate = getLastRoutineServiceDate();
  const nextRoutineDueDate = boiler.NextServiceDueDate;
  const displayedServiceHistory = serviceHistory.slice(0, 3);

  return (
    <div className="login-container">
      {/* Header with Dashboard Title and Link/Unlink Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Boiler Dashboard</h1>
        <Button 
          variant="contained"
          onClick={handleButtonClick}
          disabled={linking}
          sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
        >
          {linking ? "Processing..." : isLinked ? "Unlink boiler" : "Link Boiler to my account"}
        </Button>
      </div>
      {linkError && <Alert severity="error" sx={{ mt: 1 }}>{linkError}</Alert>}
      
      <h2>
        {boiler.Make} at {boiler.AddressLine1}, {boiler.PostalCode}
      </h2>

      {/* Visualisation Section */}
      <Box sx={{ my: 2, mx: "auto", maxWidth: 600, px: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <Box sx={{ width: 120, height: 120 }}>
            <CircularProgressbar 
              value={gaugeValue}
              maxValue={gaugeMax}
              text={`${daysUntilService} days`}
              styles={buildStyles({
                textColor: "#1A2238",
                pathColor: "#FF6A3d",
                trailColor: "#ccc",
              })}
            />
          </Box>
          <Box sx={{ textAlign: "center", ml: 3 }}>
            <div style={{ fontWeight: "bold" }}>Last Routine Service</div>
            <div style={{ fontSize: "1.2rem", color: "#1A2238" }}>
              {lastRoutineDate ? formatDate(lastRoutineDate) : "N/A"}
            </div>
            <div style={{ fontWeight: "bold", marginTop: "10px" }}>Next Routine Service Due</div>
            <div style={{ fontSize: "1.2rem", color: "#1A2238" }}>
              {nextRoutineDueDate ? formatDate(nextRoutineDueDate) : "N/A"}
            </div>
          </Box>
        </Box>
      </Box>

      {/* Button Group Toolbar */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <ButtonGroup variant="contained" sx={{ "& .MuiButtonGroup-grouped:not(:last-of-type)": { borderRight: "1px solid #9daaf2" } }}>
          <Button
            sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
            onClick={() => navigate("/newRoutineService", { state: { qrCode } })}
          >
            New Routine Service
          </Button>
          <Button
            sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
            onClick={() => navigate("/newMaintenanceLog", { state: { qrCode } })}
          >
            New Maintenance Log
          </Button>
          <Button
            sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
            onClick={() => navigate(`/viewBoilerDetails/${boiler.QRCode}`)}
          >
            View Boiler Details
          </Button>
        </ButtonGroup>
      </div>

      {/* Service History Section */}
      <h3>Service Activity</h3>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <Button
          variant="text"
          sx={{ textDecoration: "underline", color: "#1A2238" }}
          onClick={() => navigate(`/allServiceActivity/${qrCode}`)}
        >
          View all service activity
        </Button>
      </Box>
      <TableContainer component={Paper} className="boiler-table-container" style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Date</b></TableCell>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Description</b></TableCell>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedServiceHistory.length > 0 ? (
              displayedServiceHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(record.Date)}</TableCell>
                  <TableCell>{record.Description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
                      onClick={() => {
                        if (record.Description === "Routine Service") {
                          navigate(`/routineServiceDetails/${record.RecordID}`);
                        } else if (record.Description === "Maintenance Activity") {
                          navigate(`/maintenanceLogDetails/${record.RecordID}`);
                        } else {
                          console.log("Unknown service type for record:", record.RecordID);
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No service history found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        sx={{ marginTop: "20px", borderColor: "#1A2238", color: "#1A2238", "&:hover": { borderColor: "#1A2238", backgroundColor: "rgba(26,34,56,0.1)" } }}
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </Button>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>Confirm Unlink</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you unlink this boiler, you will no longer be able to access the service history or receive service due reminders.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUnlink} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subscription Limit Reached Dialog */}
      <Dialog open={maxReachedDialogOpen} onClose={() => setMaxReachedDialogOpen(false)}>
        <DialogTitle>Subscription Limit Reached</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have reached the maximum amount of linked boilers for your subscription.
            Please upgrade your subscription or unlink an existing boiler to link this one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleManageBoilers} color="primary">
            Manage Boilers
          </Button>
          <Button onClick={handleUpgrade} color="primary" autoFocus>
            Upgrade Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BoilerDashboard;
