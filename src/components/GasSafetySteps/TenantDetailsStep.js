import React, { useState } from 'react';
import { TextField, Box, Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const TenantDetailsStep = ({ data, onNext }) => {
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tenantName?.trim()) newErrors.tenantName = 'Name is required';
    if (!formData.tenantPresent) newErrors.tenantPresent = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Tenant / Home Owner Details</Typography>

      <TextField
        label="Tenant / Home Owner Name"
        fullWidth
        margin="normal"
        value={formData.tenantName || ''}
        onChange={(e) => handleChange('tenantName', e.target.value)}
        error={!!errors.tenantName}
        helperText={errors.tenantName}
      />

      <TextField
        label="Property Address"
        fullWidth
        margin="normal"
        value={formData.tenantAddress || ''}
        onChange={(e) => handleChange('tenantAddress', e.target.value)}
        disabled
      />

      <TextField
        label="Post Code"
        fullWidth
        margin="normal"
        value={formData.tenantPostcode || ''}
        onChange={(e) => handleChange('tenantPostcode', e.target.value)}
        disabled
      />

      <FormControl component="fieldset" margin="normal">
        <FormLabel>Tenant Present During Inspection?</FormLabel>
        <RadioGroup
          row
          value={formData.tenantPresent || ''}
          onChange={(e) => handleChange('tenantPresent', e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        {errors.tenantPresent && (
          <Typography color="error">{errors.tenantPresent}</Typography>
        )}
      </FormControl>

      <Box mt={2}>
        <Button variant="contained" onClick={handleNext}>Next</Button>
      </Box>
    </Box>
  );
};

export default TenantDetailsStep;
