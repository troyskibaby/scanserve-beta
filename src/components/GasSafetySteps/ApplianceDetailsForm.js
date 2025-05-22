import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const ApplianceDetailsForm = ({ data, onNext, onCancel }) => {
  const [local, setLocal] = useState(data.location || '');
  const [make, setMake] = useState(data.make || '');
  const [model, setModel] = useState(data.model || '');
  const [type, setType] = useState(data.type || '');
  const [flue, setFlue] = useState(data.flueType || '');

  const handleNext = () => {
    onNext({ location: local, make, model, type, flueType: flue });
  };

  return (
    <Box>
      <TextField label="Location" fullWidth margin="normal" value={local} onChange={(e) => setLocal(e.target.value)} />
      <TextField label="Make" fullWidth margin="normal" value={make} onChange={(e) => setMake(e.target.value)} />
      <TextField label="Model" fullWidth margin="normal" value={model} onChange={(e) => setModel(e.target.value)} />
      <TextField label="Type" fullWidth margin="normal" value={type} onChange={(e) => setType(e.target.value)} />
      <TextField label="Flue Type" fullWidth margin="normal" value={flue} onChange={(e) => setFlue(e.target.value)} />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleNext}>Next</Button>
      </Box>
    </Box>
  );
};

export default ApplianceDetailsForm;
