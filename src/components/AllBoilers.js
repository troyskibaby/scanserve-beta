// AllBoilers.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
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
  Box,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const AllBoilers = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [boilers, setBoilers] = useState([]);
  const [loadingBoilers, setLoadingBoilers] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    const fetchUserBoilers = async () => {
      try {
        const API_URL = `${config.apiUrl}/getUserBoilers?code=${config.key}`;
        // Retrieve token from localStorage (if available)
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include", // Ensures the token cookie is sent as well
          headers: headers
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load boilers.");
        } else {
          setBoilers(data.boilers);
        }
      } catch (error) {
        console.error("Error fetching user boilers:", error);
        setError("An error occurred while fetching boilers.");
      } finally {
        setLoadingBoilers(false);
      }
    };
    if (user) {
      fetchUserBoilers();
    }
  }, [user]);

  // Filter boilers based on search term (match address or postal code)
  const filteredBoilers = boilers.filter((boiler) => {
    const term = searchTerm.toLowerCase();
    const address = boiler.AddressLine1 ? boiler.AddressLine1.toLowerCase() : "";
    const postal = boiler.PostalCode ? boiler.PostalCode.toLowerCase() : "";
    return address.includes(term) || postal.includes(term);
  });

  if (loadingBoilers) return <div>Loading boilers...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="login-container">
      <h1>All Linked Boilers</h1>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          variant="outlined"
          multiline
          size="small"
          placeholder="Search by address or postal code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: "300px" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" disabled>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper} className="boiler-table-container" sx={{ mt: 2 }}>
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
            {filteredBoilers.length > 0 ? (
              filteredBoilers.map((boiler, index) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No boilers match your search.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        sx={{
          marginTop: "20px",
          borderColor: "#1A2238",
          color: "#1A2238",
          "&:hover": { borderColor: "#1A2238", backgroundColor: "rgba(26,34,56,0.1)" }
        }}
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default AllBoilers;
