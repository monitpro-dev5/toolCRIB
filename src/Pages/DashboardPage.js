import React from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import DashBoard from "../Components/Dashboard";
import MenuTabs from "../Components/MenuTabs";

const StyledGridItem = styled(Grid)(({ theme }) => ({
  marginLeft: theme.spacing(2), // Adjust the spacing value as needed
  marginRight: theme.spacing(2), // Adjust the spacing value as needed
}));

export default function DashBoardPgae() {
  return (
    <>
      <MenuTabs />
      <StyledGridItem>
        
            <DashBoard />
          
      </StyledGridItem>
    </>
  );
}
