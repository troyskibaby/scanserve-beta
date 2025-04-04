import React, { useState } from "react";
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";

const FinalChecksStep = ({ saveAppliance, prevStep, nextStep }) => {
  const [faults, setFaults] = useState("");
  const [remedialAction, setRemedialAction] = useState("");
  const [workCarriedOut, setWorkCarriedOut] = useState("");
  const [labelIssued, setLabelIssued] = useState(false);
  const [warningNoticeIssued, setWarningNoticeIssued] = useState(false);

  const handleSave = () => {
    saveAppliance({
      faults,
      remedialAction,
      workCarriedOut,
      labelIssued,
      warningNoticeIssued
    });
    nextStep();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Final Checks</Typography>

      <TextField
        label="Details of any faults"
        value={faults}
        onChange={(e) => setFaults(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <TextField
        label="Remedial Action Taken"
        value={remedialAction}
        onChange={(e) => setRemedialAction(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <TextField
        label="Details of work carried out"
        value={workCarriedOut}
        onChange={(e) => setWorkCarriedOut(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <FormControlLabel
        control={<Checkbox checked={labelIssued} onChange={(e) => setLabelIssued(e.target.checked)} />}
        label="Label Issued"
      />

      <FormControlLabel
        control={<Checkbox checked={warningNoticeIssued} onChange={(e) => setWarningNoticeIssued(e.target.checked)} />}
        label="Warning Notice Issued"
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={prevStep}>Back</Button>
        <Button variant="contained" onClick={handleSave}>Add Appliance</Button>
      </Box>
    </Box>
  );
};

export default FinalChecksStep;