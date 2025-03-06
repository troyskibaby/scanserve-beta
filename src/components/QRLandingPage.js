import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import config from '../config';

const QrLandingPage = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const startTime = Date.now();

    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/checkQrCodeRegistration?code=${config.key}&qrCode=${encodeURIComponent(qrCode)}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
          }
        );
        const data = await response.json();
        let elapsed = Date.now() - startTime;
        // Ensure the landing page is visible for at least 2 seconds.
        if (elapsed < 2000) {
          await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
        }
        if (response.ok) {
          if (data.registered) {
            navigate(`/boilerDashboard/${qrCode}`);
          } else {
            navigate(`/registerBoiler/${qrCode}`);
          }
        } else {
          navigate(`/registerBoiler/${qrCode}`);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
        navigate(`/registerBoiler/${qrCode}`);
      }
    };

    if (qrCode) {
      checkRegistrationStatus();
    }
  }, [qrCode, navigate]);

  return (
    <div className="login-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking code registration status...
        </Typography>
      </Box>
    </div>
  );
};

export default QrLandingPage;
