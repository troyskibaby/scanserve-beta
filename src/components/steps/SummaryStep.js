import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import DownloadPDFButton from "./DownloadPDFButton";

const SummaryStep = ({ appliances, boilerID, userID, onComplete, prevStep }) => {
  const recordData = {
    boilerID,
    userID,
    appliances,
    finalDetails: { submittedAt: new Date().toISOString() }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Summary of Appliances
      </Typography>

      {appliances.length === 0 ? (
        <Typography>No appliances added.</Typography>
      ) : (
        <List>
          {appliances.map((appliance, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText
                primary={`${appliance.Location} - ${appliance.Make} ${appliance.Model}`}
                secondary={`Type: ${appliance.Type}, Safe to Use: ${appliance.ApplianceSafeToUse || "N/A"}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={prevStep}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onComplete({ submittedAt: new Date().toISOString() })}
          disabled={appliances.length === 0}
        >
          Complete Record
        </Button>
      </Box>

      {appliances.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <DownloadPDFButton recordData={recordData} />
        </Box>
      )}
    </Box>
  );
};

export default SummaryStep;
