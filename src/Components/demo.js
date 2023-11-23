import React from "react";
import "../Styles/style.css";
import { Button } from "@mui/material";

function Demo() {
  const downloadpdf = () => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      // If the new tab was successfully opened, navigate in the new tab
      newTab.location.href = "/pdf/2";
    }
  };
  return (
    <>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          variant="extended"
          size="medium"
          color="secondary"
          style={{
            backgroundColor: "#2C7EDA",
            color: "#fff",
            width: 200,
            height: 40,
          }}
          onClick={downloadpdf}
        >
          Download PDF
        </Button>
      </div>
    </>
  );
}

export default Demo;
