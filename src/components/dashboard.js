// Dashboard.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "./Dashboard.css";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts';

import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [boilers, setBoilers] = useState([]);
  const [loadingBoilers, setLoadingBoilers] = useState(true);
  const [boilerError, setBoilerError] = useState("");

  // Determine max boilers based on subscription plan:
  // For PlanID 4, max = 3; for PlanID 5, max = 10.
  const maxBoilers =
    user && user.PlanID === 4 ? 3 : user && user.PlanID === 5 ? 10 : 0;
  const linkedCount = boilers.length;

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    // Fetch the boilers linked to the current user.
    const fetchUserBoilers = async () => {
      const startTime = Date.now();
      try {
        const API_URL = `${config.apiUrl}/getUserBoilers?code=${config.key}`;

        // Retrieve token from localStorage as a fallback.
        const token = localStorage.getItem("token");

        // Set up headers. Including the token in Authorization header.
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: headers,
        });
        const data = await response.json();
        if (!response.ok) {
          setBoilerError(data.message || "Failed to load boilers.");
        } else {
          setBoilers(data.boilers);
        }
      } catch (error) {
        console.error("Error fetching user boilers:", error);
        setBoilerError("An error occurred while fetching boilers.");
      } finally {
        // Ensure a minimum loading time of 1 second.
        const elapsed = Date.now() - startTime;
        const remainingTime = 1000 - elapsed;
        setTimeout(() => {
          setLoadingBoilers(false);
        }, remainingTime > 0 ? remainingTime : 0);
      }
    };

    if (user) {
      fetchUserBoilers();
    }
  }, [user]);

  // Determine if an alert should be shown:
  let alertComponent = null;
  if (linkedCount >= maxBoilers) {
    alertComponent = (
      <Alert severity="error" sx={{ mb: 2 }}>
        You have reached the maximum number of linked boilers.{" "}
        <a href="/upgrade" style={{ color: "#1A2238", textDecoration: "underline" }}>
          Upgrade your subscription
        </a>{" "}
        to link more.
      </Alert>
    );
  } else if (linkedCount === maxBoilers - 1) {
    alertComponent = (
      <Alert severity="warning" sx={{ mb: 2 }}>
        You have only 1 boiler left to link. Consider upgrading your subscription soon.
      </Alert>
    );
  }

  // Count how many boilers have their NextServiceDueDate within the next 14 days
  const countBoilersDueSoon = () => {
    if (!boilers || boilers.length === 0) return 0;
    const now = new Date();
    return boilers.filter(b => {
      if (!b.NextServiceDueDate) return false;
      const dueDate = new Date(b.NextServiceDueDate);
      const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 14;
    }).length;
  };

  const dueSoonCount = countBoilersDueSoon();
  const displayedBoilers = boilers.slice(0, 5);

  // Display a centred spinner while loading
  if (loadingBoilers) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          padding: "20px"
        }}
      >
        <CircularProgress sx={{ color: "#FF6A3d" }} />
        <Box sx={{ mt: 2, fontSize: "1.2rem", fontWeight: "bold", color: "#FF6A3d" }}>
          Loading your boilers...
        </Box>
      </Box>
    );
  }

  if (!user) return <div>Redirecting...</div>;

  return (
    <Box className="login-container">
      <h2>Welcome, {user.FirstName || user.firstName || "User"}!</h2>
      
      {alertComponent}
      
      {/* Visualisation Section */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, my: 2 }}>
        {/* Gauge: Number of Linked Boilers */}
        <Box sx={{ width: 100, height: 100 }}>
          <Gauge 
            value={linkedCount}
            text={`${linkedCount} / ${maxBoilers}`} 
            valueMin={0}
            valueMax={maxBoilers}
            margin={{ top: 5, bottom: 5 }}
            sx={(theme) => ({
              [`& .${gaugeClasses.valueArc}`]: {
                fill: '#1A2238',
              },
            })}
            aria-label="Boilers Linked Gauge"
          />
        </Box>
        {/* Infographic: Boilers with Service Due in Next 14 Days */}
        <Box sx={{ p: 2, backgroundColor: "#1A2238", color: "#fff", borderRadius: 2, minWidth: 150, textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>{dueSoonCount}</div>
          <div>Boilers with a service due in the next 14 days</div>
        </Box>
      </Box>

      {/* New button row: Register Boiler and View all boilers */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: "#1A2238", 
            color: "#fff", 
            "&:hover": { backgroundColor: "#1A2238" } 
          }}
          onClick={() => navigate("/registerBoiler")}
        >
          Register Boiler
        </Button>
        <Button 
          variant="text" 
          sx={{ textDecoration: "underline", color: "#1A2238" }}
          onClick={() => navigate("/allBoilers")}
        >
          View all boilers
        </Button>
      </Box>

      {boilerError ? (
        <p className="error" style={{ color: "red" }}>{boilerError}</p>
      ) : boilers.length > 0 ? (
        <TableContainer component={Paper} className="boiler-table-container" style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Make</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Address</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Postal Code</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBoilers.map((boiler, index) => (
                <TableRow key={index}>
                  <TableCell>{boiler.Make}</TableCell>
                  <TableCell>{boiler.AddressLine1}</TableCell>
                  <TableCell>{boiler.PostalCode}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
                      onClick={() => navigate(`/boilerDashboard/${boiler.QRCode}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>
          You have no linked boilers. Register a boiler by scanning the QR code on the tag using your device's camera, or select "Register Boiler" above.
        </p>
      )}
    </Box>
  );
};

export default Dashboard;
