import React, { useState } from 'react';
import {
  Box, TextField, Typography, Checkbox, FormControlLabel,
  RadioGroup, Radio, Button
} from '@mui/material';

const LandlordDetailsStep = ({ boiler, formData, updateData, onBack }) => {
  const [applicable, setApplicable] = useState(formData.landlordApplicable);
  const [name, setName] = useState(formData.landlordName || '');
  const [present, setPresent] = useState(formData.landlordPresent || '');

  const handleSubmit = () => {
    updateData({ landlordApplicable: applicable, landlordName: name, landlordPresent: present });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Landlord / Agent Details</Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={!applicable}
            onChange={(e) => setApplicable(!e.target.checked)}
          />
        }
        label="Not Applicable"
      />

      {applicable && (
        <>
          <TextField
            label="Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Property Address"
            fullWidth
            disabled
            margin="normal"
            value={boiler?.AddressLine1 || ''}
          />

          <TextField
            label="Post Code"
            fullWidth
            disabled
            margin="normal"
            value={boiler?.PostalCode || ''}
          />

          <Typography sx={{ mt: 2 }}>Was the landlord/agent present?</Typography>
          <RadioGroup
            row
            value={present}
            onChange={(e) => setPresent(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Next</Button>
      </Box>
    </Box>
  );
};

export default LandlordDetailsStep;
