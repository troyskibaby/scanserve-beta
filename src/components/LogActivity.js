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
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        What activity would you like to log?
      </Typography>

      {boilerType === 'Gas' ? (
        <Grid container spacing={3} justifyContent="center" mt={3}>
          {/* Card 1: Coming Soon */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                opacity: 0.5,
                pointerEvents: 'none',
                border: '2px solid #ccc',
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Typography variant="h6">Landlord Gas Safety Record</Typography>
                <Typography variant="body2">
                  Official gas appliance safety certificate
                  <br />
                  <strong>(Coming Soon)</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Routine Service */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                border: '2px solid #1A2238',
                '&:hover': { boxShadow: 6, transform: 'scale(1.03)' },
                transition: 'all 0.2s ease-in-out',
                textAlign: 'center',
              }}
              onClick={() => handleNavigate('/NewRoutineService')}
            >
              <CardContent>
                <Typography variant="h6">Routine Service Record</Typography>
                <Typography variant="body2">
                  Log a standard boiler service with required checks and notes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: General Maintenance */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                border: '2px solid #1A2238',
                '&:hover': { boxShadow: 6, transform: 'scale(1.03)' },
                transition: 'all 0.2s ease-in-out',
                textAlign: 'center',
              }}
              onClick={() => handleNavigate('/newMaintenanceLog')}
            >
              <CardContent>
                <Typography variant="h6">General Maintenance</Typography>
                <Typography variant="body2">
                  Log any boiler issues, repairs or other maintenance activity.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography color="error" align="center" mt={4}>
          Activity logging is only available for Gas boilers.
        </Typography>
      )}
    </Box>
  );
};

export default LogActivity;
