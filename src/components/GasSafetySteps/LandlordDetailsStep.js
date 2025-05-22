import React, { useState } from 'react';
import {
  TextField, Box, Button, Typography, FormControl,
  FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox
} from '@mui/material';

const LandlordDetailsStep = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.landlordNotApplicable) {
      if (!formData.landlordName?.trim()) newErrors.landlordName = 'Name is required';
      if (!formData.landlordPresent) newErrors.landlordPresent = 'This field is required';
    }
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
      <Typography variant="h6" gutterBottom>Landlord / Agent Details</Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.landlordNotApplicable || false}
            onChange={(e) => handleChange('landlordNotApplicable', e.target.checked)}
          />
        }
        label="Not Applicable"
      />

      {!formData.landlordNotApplicable && (
        <>
          <TextField
            label="Landlord / Agent Name"
            fullWidth
            margin="normal"
            value={formData.landlordName || ''}
            onChange={(e) => handleChange('landlordName', e.target.value)}
            error={!!errors.landlordName}
            helperText={errors.landlordName}
          />

          <TextField
            label="Property Address"
            fullWidth
            margin="normal"
            value={formData.landlordAddress || ''}
            onChange={(e) => handleChange('landlordAddress', e.target.value)}
            disabled
          />

          <TextField
            label="Post Code"
            fullWidth
            margin="normal"
            value={formData.landlordPostcode || ''}
            onChange={(e) => handleChange('landlordPostcode', e.target.value)}
            disabled
          />

          <FormControl component="fieldset" margin="normal">
            <FormLabel>Landlord / Agent Present During Inspection?</FormLabel>
            <RadioGroup
              row
              value={formData.landlordPresent || ''}
              onChange={(e) => handleChange('landlordPresent', e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.landlordPresent && (
              <Typography color="error">{errors.landlordPresent}</Typography>
            )}
          </FormControl>
        </>
      )}

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleNext}>Next</Button>
      </Box>
    </Box>
  );
};

export default LandlordDetailsStep;
