// ApplianceStep.js
import React from "react";
import { Box, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

const ApplianceStep = ({ data, setData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        name="Location"
        label="Appliance Location"
        value={data.Location || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="Make"
        label="Make"
        value={data.Make || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="Model"
        label="Model"
        value={data.Model || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="Type"
        label="Type (e.g. Boiler, Hob)"
        value={data.Type || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="FlueType"
        label="Flue Type (e.g. CF or RS)"
        value={data.FlueType || ""}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={data.CondenseCheck || false}
            onChange={handleChange}
            name="CondenseCheck"
          />
        }
        label="Condense Check Passed"
      />
      <Box sx={{ textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={nextStep}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ApplianceStep;