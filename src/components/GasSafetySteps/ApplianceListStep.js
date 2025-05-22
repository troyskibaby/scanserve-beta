import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, Paper
} from '@mui/material';

const ApplianceListStep = ({ appliances, onAddAppliance, onBack, onNext }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Appliances
      </Typography>

      <Paper elevation={2} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Make</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Flue Type</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appliances.length > 0 ? (
              appliances.map((appliance, index) => (
                <TableRow key={index}>
                  <TableCell>{appliance.location}</TableCell>
                  <TableCell>{appliance.make}</TableCell>
                  <TableCell>{appliance.model}</TableCell>
                  <TableCell>{appliance.type}</TableCell>
                  <TableCell>{appliance.flueType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No appliances added yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onAddAppliance}>Add Appliance</Button>
      </Box>

      {appliances.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button variant="contained" color="success" onClick={onNext}>
            Continue
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ApplianceListStep;
