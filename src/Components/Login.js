import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, Container, Typography, Box, Fab } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import BgImgae from "../Images/MCF-BG.jpg";
import { BASE_API_URL_Web } from "../API/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

// Create the theme once and reuse it
const theme = createTheme();
const defaultTheme = createTheme();

const backgroundImageStyle = {
  backgroundImage: `url(${BgImgae})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "100vh",
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

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); // Prevents the default form submission behavior

    // Call your handleFormSubmit function here
    handleFormSubmit(username, password);
  }

  const handleFormSubmit = (username, password) => {
    // Show the spinner
    setIsLoading(true);

    // Serialize form data into a JSON object
    const LoginData = {
      UserName: username,
      Password: password,
    };

    // Make a POST request to the API
    fetch(`${BASE_API_URL_Web}Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(LoginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response from the API
        console.log("Data received from API:", data);

        if (data.token !== "") {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userName", data.firstName);
          localStorage.setItem("userID", data.userID);
          localStorage.setItem("departmentID", data.departmentID);
          localStorage.setItem("departmentName", data.departmentName);
          localStorage.setItem("roleID", data.roleID);
          localStorage.setItem("roleName", data.roleName);
          localStorage.setItem("imageName", data.userImage);
          
          navigate("/toolrequest");
        } else {
          alert("Invalid UserName or Password");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div style={backgroundImageStyle}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ThemeProvider theme={defaultTheme}>
            <main>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>
                    {isLoading ? (
                      <Box style={formContainerStyle}>
                        <CircularProgress size={50} />
                      </Box>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <Box style={formContainerStyle}>
                          {" "}
                          <Typography
                            component="h1"
                            variant="h5"
                            style={{ textAlign: "center" }}
                          >
                            Sign in
                          </Typography>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Fab
                            sx={{ mt: 2, mb: 2 }}
                            type="submit"
                            variant="extended"
                            size="medium"
                            color="secondary"
                            style={{
                              backgroundColor: "#2C7EDA",
                              width: 360,
                              textAlign: "center",
                            }}
                          >
                            Login
                          </Fab>
                        </Box>
                      </form>
                    )}
                  </div>
                </Box>
              </Container>
            </main>
          </ThemeProvider>
        </ThemeProvider>
      </div>
    </>
  );
}

export default Login;
