// MenuTabs.js
import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Fab,
  Avatar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MCFLogo from "../Images/MCFLogo.jpg";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { BASE_API_URL_Web } from "../API/api";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/style.css";

export default function MenuTabs() {
  //Light NavBar
  const LightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#ffffff",
      },
    },
  });

  // #region For Logout
  const userName = localStorage.getItem("userName");
  const userID = localStorage.getItem("userID");
  const ImageName = localStorage.getItem("imageName");
  const RoleID = localStorage.getItem("roleID");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const userToken = localStorage.getItem("userToken");
    const formData = {
      token: userToken,
    };
    try {
      console.log("Token:", formData);

      const response = await fetch(`${BASE_API_URL_Web}Logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (${response.status} - ${response.statusText})`
        );
      }

      const data = await response.json();
      console.log("Data received from API:", data);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userID");
      localStorage.removeItem("departmentID");
      localStorage.removeItem("departmentName");
      localStorage.removeItem("roleID");
      localStorage.removeItem("roleName");
      localStorage.removeItem("imageName");

      navigate("/login");
    } catch (error) {
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
    }
  };
  // #endregion

  //#region Image File

  const [Image, setImage] = useState();
  useEffect(() => {
    if (ImageName !== "" && ImageName !== null && ImageName) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL_Web}UserImage?fileName=${ImageName}`
          );

          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
          } else {
            console.error("Error getting image: ", response.status);
          }
        } catch (error) {
          console.error("Error getting image: ", error);
        }
      };

      fetchImage();
    }
  }, [ImageName]);

  const UpdateProfile = () => {
    navigate("/userupdate/" + userID);
  };
  //#endregion

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={LightTheme}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <img
                  src={MCFLogo}
                  alt="MCF Logo"
                  style={{ width: 100, padding: 5 }}
                />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <div className="dropdown">
                  <Button
                    className="dropdown"
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{
                      backgroundColor: "#2C7EDA",

                      width: "150px",
                      color: "#fff",
                    }}
                  >
                    Tools
                  </Button>
                  <div
                    className="dropdown-contenttool"
                    style={{ width: "110px" }}
                  >
                    {/* TOOL-CRIB MANAGER */}
                    {RoleID === "16" && (
                      <Link
                        to="/addtool"
                        className="linkWithoutUnderline"
                        style={{ textDecoration: "none" }} // Remove underline on the link
                      >
                        <Typography>Add Tool</Typography>
                      </Link>
                    )}
                    <Link
                      to="/toollist"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Tool List</Typography>
                    </Link>
                    {/* TOOL-CRIB MANAGER */}
                    {RoleID === "16" && (
                      <Link
                        to="/scheduler"
                        className="linkWithoutUnderline"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography>Tool Scheduler</Typography>
                      </Link>
                    )}
                  </div>
                </div>
                &nbsp;
                <div className="dropdown">
                  <Button
                    className="dropdown"
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{
                      backgroundColor: "#2C7EDA",
                      width: "150px",
                      color: "#fff",
                    }}
                  >
                    Inspection
                  </Button>
                  <div
                    className="dropdown-contentinspection"
                    style={{ width: "110px" }}
                  >
                    <Link
                      to="/inspectionlist"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Inspection List</Typography>
                    </Link>
                    <Link
                      to="/inspectionhistory"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Inspection History</Typography>
                    </Link>
                  </div>
                </div>
                &nbsp;
                <div className="dropdown">
                  <Button
                    className="dropdown"
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{
                      backgroundColor: "#2C7EDA",

                      width: "150px",
                      color: "#fff",
                    }}
                  >
                    Issue Tools
                  </Button>
                  <div className="dropdown-contentissue">
                    {RoleID !== "3" && (
                      <Link
                        to="/toolrequest"
                        className="linkWithoutUnderline"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography>Tool Request</Typography>
                      </Link>
                    )}
                    <Link
                      to="/issuelist"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Issue List</Typography>
                    </Link>
                    <Link
                      to="/toolissuehistory"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Issue History</Typography>
                    </Link>
                  </div>
                </div>
                &nbsp;
                <div className="dropdown">
                  <Button
                    className="dropdown"
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{
                      backgroundColor: "#2C7EDA",

                      width: "150px",
                      color: "#fff",
                    }}
                  >
                    Gate Pass
                  </Button>
                  <div className="dropdown-contentissue">
                    <Link
                      to={"/gatepass/0"}
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Gate Pass Req</Typography>
                    </Link>
                    <Link
                      to="/gatepasslist"
                      className="linkWithoutUnderline"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography>Gate Pass List</Typography>
                    </Link>
                  </div>
                </div>
                &nbsp;
                <Link
                  to="/toolauditlist"
                  className="linkWithoutUnderline"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                  >
                    Tool Audit
                  </Button>
                </Link>
                &nbsp;
                {/* <Link
                  to="/dashboard"
                  className="linkWithoutUnderline"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                  >
                    Home
                  </Button>
                </Link>
                &nbsp;
                 <Link
                  to="/demo"
                  className="linkWithoutUnderline"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                  >
                    demo
                  </Button>
                </Link> */}
                {/* Admin */}
                {RoleID === "3" && (
                  <div className="dropdown">
                    <Button
                      className="dropdown"
                      variant="extended"
                      size="medium"
                      color="secondary"
                      style={{
                        backgroundColor: "#2C7EDA",

                        width: "100px",
                        color: "#fff",
                      }}
                    >
                      Admin
                    </Button>
                    <div className="dropdown-contentissue">
                      <Link
                        to="/usercreate"
                        className="linkWithoutUnderline"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography>Create User</Typography>
                      </Link>
                      <Link
                        to="/userlist"
                        className="linkWithoutUnderline"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography>User List</Typography>
                      </Link>
                    </div>
                  </div>
                )}
              </Typography>
              {Image ? (
                <img
                  src={Image}
                  alt=""
                  style={{
                    height: 40,
                    width: 40,
                    marginTop: 3,
                    cursor: "pointer",
                  }}
                  onClick={UpdateProfile}
                />
              ) : (
                <Avatar
                  variant="square"
                  style={{ width: 40, height: 40, cursor: "pointer" }}
                  onClick={UpdateProfile}
                />
              )}
              &nbsp;&nbsp;
              <Button
                disabled
                variant="extended"
                size="medium"
                color="secondary"
                style={{
                  height: 30,
                  backgroundColor: "#3DD518",
                  color: "#fff",
                  textTransform: "none",
                }}
              >
                {userName}
              </Button>
              &nbsp;&nbsp;
              <Fab
                onClick={handleLogout}
                size="small"
                style={{
                  backgroundColor: "#F01414",
                  color: "#fff",
                  textTransform: "none",
                }}
                title="Logout"
              >
                <PowerSettingsNewIcon />
              </Fab>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    </>
  );
}
