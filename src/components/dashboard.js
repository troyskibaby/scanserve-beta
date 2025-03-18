import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonGroup,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [boilers, setBoilers] = useState([]);
  const [loadingBoilers, setLoadingBoilers] = useState(true);
  const [boilerError, setBoilerError] = useState("");

  const maxBoilers = user?.PlanID === 4 ? 3 : user?.PlanID === 5 ? 10 : 0;
  const linkedCount = boilers.length;

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    const fetchUserBoilers = async () => {
      try {
        const API_URL = `${config.apiUrl}/getUserBoilers?code=${config.key}`;
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, { method: "GET", credentials: "include", headers });
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

  const displayedBoilers = boilers.slice(0, 5);

  if (loadingBoilers) return <div>Loading boilers...</div>;
  if (!user) return <div>Redirecting...</div>;

  return (
    <Box className="login-container">
      <h2>Welcome, {user.FirstName || user.firstName || "User"}!</h2>

      {alertComponent}

      {/* White Background Content Box */}
      <Box sx={{ my: 2, mx: "auto", maxWidth: 800, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1, p: 3 }}>
        
        {/* Visualisation Section */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} display="flex" justifyContent="center">
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{
              p: 2,
              backgroundColor: "#1A2238",
              color: "#fff",
              borderRadius: 2,
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem" }}>{linkedCount}</div>
              <div>Boilers currently linked</div>
            </Box>
          </Grid>
        </Grid>

        {/* Button Toolbar */}
        <Box sx={{ mt: 3, mb: 3, textAlign: "center" }}>
          <ButtonGroup variant="contained">
            <Button
              sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
              onClick={() => navigate("/registerBoiler")}
            >
              Register Boiler
            </Button>
            <Button
              sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
              onClick={() => navigate("/allBoilers")}
            >
              View all boilers
            </Button>
          </ButtonGroup>
        </Box>

        {/* Table Section */}
        {boilerError ? (
          <p style={{ color: "red" }}>{boilerError}</p>
        ) : boilers.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {["QRCode", "Make", "Address", "Postal Code", "Actions"].map((head) => (
                    <TableCell key={head} sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}>
                      <b>{head}</b>
                    </TableCell>
                  ))}
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
                        sx={{ backgroundColor: "#1A2238", color: "#fff" }}
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
          <p>No linked boilers found.</p>
        )}
      </Box>

      <Button
        variant="outlined"
        sx={{
          mt: 2,
          borderColor: "#1A2238",
          color: "#1A2238",
          "&:hover": { borderColor: "#1A2238", backgroundColor: "rgba(26,34,56,0.1)" },
        }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default Dashboard;
