// LogActivity.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';

const LogActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const qrCode = location.state?.qrCode || '';
  const boilerType = location.state?.boilerType || '';

  const handleNavigate = (path) => {
    navigate(path, { state: { qrCode } });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        What activity would you like to log?
      </Typography>

      {boilerType === 'Gas' ? (
        <Grid container spacing={3}>
          {/* 1. Landlord Gas Safety Record (Coming Soon) */}
          <Grid item xs={12} md={4}>
            <Card sx={{ opacity: 0.5, cursor: 'not-allowed' }}>
              <CardContent>
                <Typography variant="h6">Landlord Gas Safety Record</Typography>
                <Typography variant="body2" color="text.secondary">
                  Official certificate of gas appliance safety <br />
                  <strong>(Coming Soon)</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Routine Service Record */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}
              onClick={() => handleNavigate('/NewRoutineService')}
            >
              <CardContent>
                <Typography variant="h6">Routine Service Record</Typography>
                <Typography variant="body2" color="text.secondary">
                  Log a standard service with key checks and service notes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. General Maintenance */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}
              onClick={() => handleNavigate('/newMaintenanceLog')}
            >
              <CardContent>
                <Typography variant="h6">General Maintenance</Typography>
                <Typography variant="body2" color="text.secondary">
                  Track general issues or repair activity not tied to servicing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="error" mt={2}>
          Activity logging is only available for Gas boilers.
        </Typography>
      )}
    </Box>
  );
};

export default LogActivity;
