import React from "react";
import { Box, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

const FlueTestStep = ({ data, setData, nextStep, prevStep }) => {
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
        name="FlueIntegrity"
        label="Flue Integrity (Pass/Fail)"
        value={data.FlueIntegrity || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="SpillageTest"
        label="Spillage Test (Pass/Fail)"
        value={data.SpillageTest || ""}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.TerminalVisualCheck || false}
            onChange={handleChange}
            name="TerminalVisualCheck"
          />
        }
        label="Terminal Visual Check Passed"
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

export default FlueTestStep;