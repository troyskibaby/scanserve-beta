import React, { useState } from 'react';
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Typography
} from '@mui/material';

const ResultsForm = ({ data, onNext, onBack }) => {
  const [applianceSafe, setApplianceSafe] = useState(data.applianceSafeToUse || '');
  const [isLandlords, setIsLandlords] = useState(data.isLandlordsAppliance || '');
  const [inspected, setInspected] = useState(data.applianceInspected || '');
  const [faultDetails, setFaultDetails] = useState(data.faultDetails || '');
  const [remedialAction, setRemedialAction] = useState(data.remedialAction || '');
  const [workDetails, setWorkDetails] = useState(data.workDetails || '');
  const [warningIssued, setWarningIssued] = useState(data.warningIssued || '');

  const handleSubmit = () => {
    onNext({
      applianceSafeToUse: applianceSafe,
      isLandlordsAppliance: isLandlords,
      applianceInspected: inspected,
      faultDetails,
      remedialAction,
      workDetails,
      warningIssued
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Results & Additional Info</Typography>

      <RadioGroup row value={applianceSafe} onChange={(e) => setApplianceSafe(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Appliance Safe to Use" />
        <FormControlLabel value="No" control={<Radio />} label="Unsafe Appliance" />
      </RadioGroup>

      <RadioGroup row value={isLandlords} onChange={(e) => setIsLandlords(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Landlord's Appliance" />
        <FormControlLabel value="No" control={<Radio />} label="Not Landlord's Appliance" />
      </RadioGroup>

      <RadioGroup row value={inspected} onChange={(e) => setInspected(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Appliance Inspected" />
        <FormControlLabel value="No" control={<Radio />} label="Not Inspected" />
      </RadioGroup>

      <TextField
        label="Fault Details"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={faultDetails}
        onChange={(e) => setFaultDetails(e.target.value)}
      />

      <TextField
        label="Remedial Action Taken"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={remedialAction}
        onChange={(e) => setRemedialAction(e.target.value)}
      />

      <TextField
        label="Details of Work Carried Out"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={workDetails}
        onChange={(e) => setWorkDetails(e.target.value)}
      />

      <RadioGroup row value={warningIssued} onChange={(e) => setWarningIssued(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Label or Warning Notice Issued" />
        <FormControlLabel value="No" control={<Radio />} label="No Label or Warning" />
      </RadioGroup>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Save Appliance</Button>
      </Box>
    </Box>
  );
};

export default ResultsForm;
