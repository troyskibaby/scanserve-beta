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
  Alert
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
      try {
        const API_URL = `${config.apiUrl}/getUserBoilers?code=${config.key}`;
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include", // Ensure the token cookie is sent.
          headers: { "Content-Type": "application/json" }
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
        setLoadingBoilers(false);
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


  if (loadingBoilers) return <div>Loading boilers...</div>;
  if (!user) return <div>Redirecting...</div>;

  return (
    <div className="login-container">
      <h2>Welcome, {user.FirstName || user.firstName || "User"}!</h2>
      
      {alertComponent}
      
      {/* Visualisation Section */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, my: 2 }}>
        {/* Gauge: Number of Linked Boilers */}
        <div>
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
        </div>
        {/* Infographic: Boilers with Service Due in Next 14 Days */}
        <Box sx={{ p: 2, backgroundColor: "#1A2238", color: "#fff", borderRadius: 2, minWidth: 150, textAlign: "center" }}>
        <div style={{ fontSize: "2rem" }}>{dueSoonCount}</div>
        <div >Boilers with a service due in the next 14 days</div>
        </Box>
      </Box>

      <br></br>
       {/* Button to view all boilers (aligned right) */}
       <Box sx={{ textAlign: "right", mb: 1 }}>
        <Button 
          variant="text" 
          sx={{ textDecoration: "underline", color: "#1A2238" }}
          onClick={() => navigate("/allBoilers")}
        >
          View all boilers
        </Button>
      </Box>

      {loadingBoilers ? (
        <p>Loading boilers...</p>
      ) : boilerError ? (
        <p className="error" style={{ color: "red" }}>{boilerError}</p>
      ) : boilers.length > 0 ? (
        <TableContainer component={Paper} className="boiler-table-container" style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>QRCode</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Make</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Address</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Postal Code</b></TableCell>
                <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBoilers.map((boiler, index) => (
                <TableRow key={index}>
                  <TableCell>{boiler.QRCode}</TableCell>
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
        <p>You have no linked boilers.</p>
      )}
    </div>
  );
};

export default Dashboard;
