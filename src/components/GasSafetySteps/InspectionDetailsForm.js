import React, { useState } from 'react';
import { Box, TextField, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

const InspectionDetailsForm = ({ data, onNext, onBack }) => {
  const [pressure, setPressure] = useState(data.operatingPressure || '');
  const [input, setInput] = useState(data.heatInput || '');
  const [safety, setSafety] = useState(data.safetyDeviceWorks || '');

  const handleSubmit = () => {
    onNext({
      operatingPressure: pressure,
      heatInput: input,
      safetyDeviceWorks: safety,
    });
  };

  return (
    <Box>
      <TextField
        label="Operating Pressure (mbar)"
        fullWidth
        margin="normal"
        value={pressure}
        onChange={(e) => setPressure(e.target.value)}
      />
      <TextField
        label="Heat Input (kW)"
        fullWidth
        margin="normal"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <RadioGroup
        row
        value={safety}
        onChange={(e) => setSafety(e.target.value)}
      >
        <FormControlLabel value="Yes" control={<Radio />} label="Safety Device Works" />
        <FormControlLabel value="No" control={<Radio />} label="Safety Device Fault" />
      </RadioGroup>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Save Appliance</Button>
      </Box>
    </Box>
  );
};

export default InspectionDetailsForm;
