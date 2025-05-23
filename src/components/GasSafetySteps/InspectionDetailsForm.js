import React, { useState } from 'react';
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormLabel,
  FormControl,
  Typography
} from '@mui/material';

const InspectionDetailsForm = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState({
    operatingPressure: data.operatingPressure || '',
    heatInput: data.heatInput || '',
    safetyDeviceWorks: data.safetyDeviceWorks || '',
    ventilationAdequate: data.ventilationAdequate || '',
    coAlarmFitted: data.coAlarmFitted || '',
    coAlarmTested: data.coAlarmTested || '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
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
        onChange={handleChange('operatingPressure')}
      />

      <TextField
        label="Heat Input (kW)"
        fullWidth
        margin="normal"
        type="number"
        value={form.heatInput}
        onChange={handleChange('heatInput')}
      />

      <FormControl fullWidth margin="normal">
        <FormLabel>Safety Device Correct Operation</FormLabel>
        <RadioGroup
          value={form.safetyDeviceWorks}
          onChange={handleChange('safetyDeviceWorks')}
          row
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Ventilation Adequate</FormLabel>
        <RadioGroup
          value={form.ventilationAdequate}
          onChange={handleChange('ventilationAdequate')}
          row
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>CO Alarm Fitted</FormLabel>
        <RadioGroup
          value={form.coAlarmFitted}
          onChange={handleChange('coAlarmFitted')}
          row
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>CO Alarm Tested</FormLabel>
        <RadioGroup
          value={form.coAlarmTested}
          onChange={handleChange('coAlarmTested')}
          row
        >
          <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
          <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default InspectionDetailsForm;
