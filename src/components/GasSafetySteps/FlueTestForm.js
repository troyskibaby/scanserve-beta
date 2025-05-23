import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  ButtonGroup
} from '@mui/material';

// Shared ButtonGroup for Pass/Fail
const PassFailButtonGroup = ({ label, value, onChange }) => (
  <FormControl fullWidth margin="normal">
    <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>
    <ButtonGroup fullWidth variant="outlined">
      <Button
        onClick={() => onChange("Pass")}
        sx={{
          backgroundColor: value === "Pass" ? "green" : "inherit",
          color: value === "Pass" ? "#fff" : "inherit",
          borderColor: "green",
          '&:hover': { backgroundColor: value === "Pass" ? "green" : "rgba(0,0,0,0.04)" }
        }}
      >
        Pass
      </Button>
      <Button
        onClick={() => onChange("Fail")}
        sx={{
          backgroundColor: value === "Fail" ? "red" : "inherit",
          color: value === "Fail" ? "#fff" : "inherit",
          borderColor: "red",
          '&:hover': { backgroundColor: value === "Fail" ? "red" : "rgba(0,0,0,0.04)" }
        }}
      >
        Fail
      </Button>
    </ButtonGroup>
  </FormControl>
);

const FlueTestForm = ({ data, onNext, onBack }) => {
  const [flueFlow, setFlueFlow] = useState(data.flueFlowTest || '');
  const [spillage, setSpillage] = useState(data.spillageTest || '');
  const [termination, setTermination] = useState(data.terminationSatisfactory || '');
  const [visualCondition, setVisualCondition] = useState(data.visualCondition || '');
  const [combustionRatio, setCombustionRatio] = useState(data.combustionRatio || '');

  const handleSubmit = () => {
    onNext({
      flueFlowTest: flueFlow,
      spillageTest: spillage,
      terminationSatisfactory: termination,
      visualCondition: visualCondition,
      combustionRatio: combustionRatio,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Flue Test Details
      </Typography>

      <PassFailButtonGroup
        label="Flue Flow Test"
        value={flueFlow}
        onChange={setFlueFlow}
      />

      <PassFailButtonGroup
        label="Spillage Test"
        value={spillage}
        onChange={setSpillage}
      />

      <FormControl fullWidth margin="normal">
        <FormLabel>Termination Satisfactory</FormLabel>
        <RadioGroup
          value={termination}
          onChange={(e) => setTermination(e.target.value)}
          row
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <PassFailButtonGroup
        label="Visual Condition"
        value={visualCondition}
        onChange={setVisualCondition}
      />

      <TextField
        label="Combustion Performance Reading (CO: CO2 Ratio / CO2 CO)"
        fullWidth
        margin="normal"
        value={combustionRatio}
        onChange={(e) => setCombustionRatio(e.target.value)}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default FlueTestForm;
