// AllServiceActivity.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import config from "../config";
import { AuthContext } from "./AuthContext";

// Helper function to format date strings
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

const AllServiceActivity = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const { user, loadingAuth } = useContext(AuthContext);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");

  // Dropdown filter state
  // Options: "3" for last 3 months, "6" for last 6 months, "7" for older than 6 months.
  const [filterValue, setFilterValue] = useState("6");

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

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
            setError(data.message || "Failed to load service history.");
          } else {
            setServiceHistory(data.serviceHistory);
          }
        } catch (err) {
          console.error("Error fetching service history:", err);
          setError("An error occurred while fetching service history.");
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchServiceHistory();
    } else {
      setError("No QR code provided.");
      setLoadingHistory(false);
    }
  }, [qrCode]);

  // Filter service history based on the dropdown value.
  // "3" => records from last 3 months,
  // "6" => records from last 6 months,
  // "7" => records older than 6 months.
  const filteredServiceHistory = serviceHistory.filter(record => {
    const recordDate = new Date(record.Date);
    const now = new Date();
    const diffMonths = (now - recordDate) / (1000 * 60 * 60 * 24 * 30); // approximate months difference
    if (filterValue === "3") {
      return diffMonths <= 3;
    } else if (filterValue === "6") {
      return diffMonths <= 6;
    } else if (filterValue === "7") {
      return diffMonths > 6;
    }
    return true;
  });

  if (loadingHistory) return <div>Loading service history...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="login-container">
      <h1>All Service Activity</h1>
      
      {/* Filter Dropdown */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="filter-label">Filter by Date</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filterValue}
            label="Filter by Date"
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{
                backgroundColor: "#fff", // white background
                color: "#000",           // text color, change if needed
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF6A3d",   // white border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF6A3d",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF6A3d",
                },
              }}
          >
            <MenuItem value="3">Last 3 months</MenuItem>
            <MenuItem value="6">Last 6 months</MenuItem>
            <MenuItem value="7">Older than 6 months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Date</b></TableCell>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Description</b></TableCell>
              <TableCell sx={{ backgroundColor: "#FF6A3d", color: "#fff" }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServiceHistory.length > 0 ? (
              filteredServiceHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(record.Date)}</TableCell>
                  <TableCell>{record.Description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#1A2238", color: "#fff", "&:hover": { backgroundColor: "#1A2238" } }}
                      onClick={() => {
                        // Conditional navigation based on service type
                        if(record.Description === "Routine Service"){
                          navigate(`/routineServiceDetails/${record.RecordID}`);
                        } else if(record.Description === "Maintenance Activity"){
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
                <TableCell colSpan={3}>No service activity found for this period.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Button
        variant="outlined"
        sx={{ mt: 2, borderColor: "#1A2238", color: "#1A2238", "&:hover": { borderColor: "#1A2238", backgroundColor: "rgba(26,34,56,0.1)" } }}
        onClick={() => navigate(`/boilerDashboard/${qrCode}`)}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default AllServiceActivity;
