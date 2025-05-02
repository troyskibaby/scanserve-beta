import React from "react";
import { Button } from "@mui/material";

const DownloadPDFButton = ({ recordData }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch("/api/submitGasSafetyRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "GasSafetyRecord.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleDownload}>
      Download Gas Safety PDF
    </Button>
  );
};

export default DownloadPDFButton;
