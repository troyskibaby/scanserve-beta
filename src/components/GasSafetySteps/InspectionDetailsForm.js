import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  ButtonGroup
} from '@mui/material';

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

const InspectionDetailsForm = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState({
    operatingPressure: data.operatingPressure || '',
    heatInput: data.heatInput || '',
    safetyDeviceWorks: data.safetyDeviceWorks || '',
    ventilationAdequate: data.ventilationAdequate || '',
    coAlarmFitted: data.coAlarmFitted || '',
    coAlarmTested: data.coAlarmTested || '',
  });

  const handleChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onNext(form);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Inspection Details</Typography>

      <TextField
        label="Operating Pressure (mbar)"
        fullWidth
        margin="normal"
        type="number"
        value={form.operatingPressure}
        onChange={(e) => handleChange('operatingPressure')(e.target.value)}
      />

      <TextField
        label="Heat Input (kW)"
        fullWidth
        margin="normal"
        type="number"
        value={form.heatInput}
        onChange={(e) => handleChange('heatInput')(e.target.value)}
      />

      <FormControl fullWidth margin="normal">
        <FormLabel>Safety Device Correct Operation</FormLabel>
        <RadioGroup
          row
          value={form.safetyDeviceWorks}
          onChange={(e) => handleChange('safetyDeviceWorks')(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Ventilation Adequate</FormLabel>
        <RadioGroup
          row
          value={form.ventilationAdequate}
          onChange={(e) => handleChange('ventilationAdequate')(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>CO Alarm Fitted</FormLabel>
        <RadioGroup
          row
          value={form.coAlarmFitted}
          onChange={(e) => handleChange('coAlarmFitted')(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <PassFailButtonGroup
        label="CO Alarm Tested"
        value={form.coAlarmTested}
        onChange={handleChange('coAlarmTested')}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default InspectionDetailsForm;
