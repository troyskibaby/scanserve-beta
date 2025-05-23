import React, { useState } from 'react';
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  FormLabel,
  FormControl
} from '@mui/material';

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

      <FormControl fullWidth margin="normal">
        <FormLabel>Flue Flow Test</FormLabel>
        <RadioGroup
          value={flueFlow}
          onChange={(e) => setFlueFlow(e.target.value)}
        >
          <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
          <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Spillage Test</FormLabel>
        <RadioGroup
          value={spillage}
          onChange={(e) => setSpillage(e.target.value)}
        >
          <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
          <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Termination Satisfactory</FormLabel>
        <RadioGroup
          value={termination}
          onChange={(e) => setTermination(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Visual Condition</FormLabel>
        <RadioGroup
          value={visualCondition}
          onChange={(e) => setVisualCondition(e.target.value)}
        >
          <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
          <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
        </RadioGroup>
      </FormControl>

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
