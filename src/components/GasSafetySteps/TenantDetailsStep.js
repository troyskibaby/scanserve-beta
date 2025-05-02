import React, { useState } from 'react';
import { Box, TextField, Button, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const TenantDetailsStep = ({ boiler, formData, updateData }) => {
  const [name, setName] = useState(formData.tenantName || '');
  const [present, setPresent] = useState(formData.tenantPresent || '');

  const handleSubmit = () => {
    updateData({ tenantName: name, tenantPresent: present });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Tenant / Home Owner Details</Typography>

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

      <Typography sx={{ mt: 2 }}>Was the tenant/homeowner present?</Typography>
      <RadioGroup
        row
        value={present}
        onChange={(e) => setPresent(e.target.value)}
      >
        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="No" control={<Radio />} label="No" />
      </RadioGroup>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!name || !present}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default TenantDetailsStep;
