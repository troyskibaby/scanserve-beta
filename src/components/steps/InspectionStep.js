import React from "react";
import { Box, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

const InspectionStep = ({ data, setData, nextStep, prevStep }) => {
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
        name="OperatingPressure"
        label="Operating Pressure (mbar)"
        type="number"
        value={data.OperatingPressure || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="HeatInput"
        label="Heat Input (kW)"
        type="number"
        value={data.HeatInput || ""}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.VentilationAdequate || false}
            onChange={handleChange}
            name="VentilationAdequate"
          />
        }
        label="Ventilation Adequate"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.SafetyDeviceOperational || false}
            onChange={handleChange}
            name="SafetyDeviceOperational"
          />
        }
        label="Safety Device Operational"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.COAlarmFitted || false}
            onChange={handleChange}
            name="COAlarmFitted"
          />
        }
        label="CO Alarm Fitted"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.COAlarmTestPass || false}
            onChange={handleChange}
            name="COAlarmTestPass"
          />
        }
        label="CO Alarm Test Pass"
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

export default InspectionStep;