import React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  //#region Loading
  const backgroundImageStyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // Center both horizontally and vertically
    flexDirection: "column",
  };

  const formContainerStyle = {
    background: "rgba(255, 255, 255, 0.9)", // Add a semi-transparent white background
    padding: "20px",
    borderRadius: "8px",
  };
  //#endregion

  return (
    <div style={backgroundImageStyle}>
      <Box style={formContainerStyle}>
        <CircularProgress size={50} />
      </Box>
    </div>
  );
}
