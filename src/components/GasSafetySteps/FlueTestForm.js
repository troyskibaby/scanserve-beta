import React, { useState } from 'react';
import { Box, TextField, RadioGroup, FormControlLabel, Radio, Button, Typography } from '@mui/material';

const FlueTestForm = ({ data, onNext, onBack }) => {
  const [flueFlow, setFlueFlow] = useState(data.flueFlowTest || '');
  const [spillage, setSpillage] = useState(data.spillageTest || '');
  const [termination, setTermination] = useState(data.terminationSatisfactory || '');
  const [visualCondition, setVisualCondition] = useState(data.visualCondition || '');
  const [combustionRatio, setCombustionRatio] = useState(data.combustionRatio || '');
  const [coAlarmFitted, setCoAlarmFitted] = useState(data.coAlarmFitted || '');
  const [coAlarmTested, setCoAlarmTested] = useState(data.coAlarmTested || '');

  const handleSubmit = () => {
    onNext({
      flueFlowTest: flueFlow,
      spillageTest: spillage,
      terminationSatisfactory: termination,
      visualCondition: visualCondition,
      combustionRatio: combustionRatio,
      coAlarmFitted: coAlarmFitted,
      coAlarmTested: coAlarmTested
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Flue Test Details</Typography>

      <RadioGroup row value={flueFlow} onChange={(e) => setFlueFlow(e.target.value)}>
        <FormControlLabel value="Pass" control={<Radio />} label="Flue Flow Test Pass" />
        <FormControlLabel value="Fail" control={<Radio />} label="Flue Flow Test Fail" />
      </RadioGroup>

      <RadioGroup row value={spillage} onChange={(e) => setSpillage(e.target.value)}>
        <FormControlLabel value="Pass" control={<Radio />} label="Spillage Test Pass" />
        <FormControlLabel value="Fail" control={<Radio />} label="Spillage Test Fail" />
      </RadioGroup>

      <RadioGroup row value={termination} onChange={(e) => setTermination(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Termination Satisfactory" />
        <FormControlLabel value="No" control={<Radio />} label="Termination Unsatisfactory" />
      </RadioGroup>

      <RadioGroup row value={visualCondition} onChange={(e) => setVisualCondition(e.target.value)}>
        <FormControlLabel value="Pass" control={<Radio />} label="Visual Condition Pass" />
        <FormControlLabel value="Fail" control={<Radio />} label="Visual Condition Fail" />
      </RadioGroup>

      <TextField
        label="Combustion Performance Reading (CO: CO2 Ratio / CO2 CO)"
        fullWidth
        margin="normal"
        value={combustionRatio}
        onChange={(e) => setCombustionRatio(e.target.value)}
      />

      <RadioGroup row value={coAlarmFitted} onChange={(e) => setCoAlarmFitted(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="CO Alarm Fitted" />
        <FormControlLabel value="No" control={<Radio />} label="No CO Alarm" />
      </RadioGroup>

      <RadioGroup row value={coAlarmTested} onChange={(e) => setCoAlarmTested(e.target.value)}>
        <FormControlLabel value="Pass" control={<Radio />} label="CO Alarm Test Pass" />
        <FormControlLabel value="Fail" control={<Radio />} label="CO Alarm Test Fail" />
      </RadioGroup>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default FlueTestForm;
