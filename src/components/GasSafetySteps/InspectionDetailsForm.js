import React, { useState } from 'react';
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Button
} from '@mui/material';

const InspectionDetailsForm = ({ data, onNext, onBack }) => {
  const [pressure, setPressure] = useState(data.operatingPressure || '');
  const [input, setInput] = useState(data.heatInput || '');
  const [safety, setSafety] = useState(data.safetyDeviceWorks || '');
  const [ventilation, setVentilation] = useState(data.ventilationAdequate || '');
  const [coAlarm, setCoAlarm] = useState(data.coAlarmFitted || '');
  const [coTested, setCoTested] = useState(data.coAlarmTested || '');

  const handleSubmit = () => {
    onNext({
      operatingPressure: pressure,
      heatInput: input,
      safetyDeviceWorks: safety,
      ventilationAdequate: ventilation,
      coAlarmFitted: coAlarm,
      coAlarmTested: coTested
    });
  };

  return (
    <Box>
      <TextField
        label="Operating Pressure (mbar)"
        fullWidth
        margin="normal"
        type="number"
        value={pressure}
        onChange={(e) => setPressure(e.target.value)}
      />
      <TextField
        label="Heat Input (kW)"
        fullWidth
        margin="normal"
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <FormControl component="fieldset" margin="normal">
        <FormLabel>Safety Device Correct Operation</FormLabel>
        <RadioGroup row value={safety} onChange={(e) => setSafety(e.target.value)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel>Ventilation Adequate</FormLabel>
        <RadioGroup row value={ventilation} onChange={(e) => setVentilation(e.target.value)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel>CO Alarm Fitted</FormLabel>
        <RadioGroup row value={coAlarm} onChange={(e) => setCoAlarm(e.target.value)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel>CO Alarm Tested</FormLabel>
        <RadioGroup row value={coTested} onChange={(e) => setCoTested(e.target.value)}>
          <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
          <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default InspectionDetailsForm;
