import React from "react";
import { Box, TextField, Button, FormControlLabel, Checkbox, MenuItem } from "@mui/material";

const ResultsStep = ({ data, setData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        select
        name="ApplianceSafeToUse"
        label="Is Appliance Safe to Use?"
        value={data.ApplianceSafeToUse || ""}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
        <MenuItem value="N/A">N/A</MenuItem>
      </TextField>

      <TextField
        name="WarningNoticeIssued"
        label="Warning Notice (if any)"
        value={data.WarningNoticeIssued || ""}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        name="LabelIssued"
        label="Labels Issued (if any)"
        value={data.LabelIssued || ""}
        onChange={handleChange}
        fullWidth
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={prevStep}>
          Back
        </Button>
        <Button variant="contained" onClick={nextStep}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsStep;