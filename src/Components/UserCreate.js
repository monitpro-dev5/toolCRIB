import React, { useState } from "react";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  TextField,
  Grid,
  Autocomplete,
  Button,
  Skeleton,
  IconButton,
  InputAdornment,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function UserCreate() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion
  const navigate = useNavigate();
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);

  // #region Field Values
  const [department, setDepartment] = useState(null);
  const [firstnamevalue, setFirstnamevalue] = useState("");
  const [lastnamevalue, setLastnamevalue] = useState("");
  const [employeeIDvalue, setemployeeIDvalue] = useState("");
  const [usernamevalue, setusernamevalue] = useState("");
  const [passwordvalue, setPasswordvalue] = useState("");
  const [emailvalue, setEmailvalue] = useState("");
  const isValidEmail = (email) => {
    // Regular expression for a simple email validation (ending with "@gmail.com")
    const emailRegex = /\S+@gmail\.com$/i;
    return email === "" || emailRegex.test(email);
  };

  const [mobilevalue, setmobilevalue] = useState("");
  const [rolevalue, setrolevalue] = useState(null);
  const [designationvalue, setDesignationvalue] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [interacted, setInteracted] = useState(false);

  // #endregion

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //#region submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !firstnamevalue ||
      !lastnamevalue ||
      !employeeIDvalue ||
      !usernamevalue ||
      !passwordvalue ||
      !rolevalue ||
      !department ||
      !designationvalue
    ) {
      setInteracted(true);
      return;
    }

    const formdata = {
      firstName: firstnamevalue,
      lastName: lastnamevalue,
      employeeID: employeeIDvalue,
      userName: usernamevalue,
      password: passwordvalue,
      emailAddress: emailvalue,
      mobileNumber: mobilevalue,
      selectedRole: rolevalue.value,
      departID: department.value,
      designation: designationvalue,
      userID: 0,
    };

    setIsLoading(true);
    try {
      console.log("form data", formdata);
      const response = await fetch(`${BASE_API_URL_Web}UserInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      if (responseData.errorMessage === "UserName Already Exists") {
        alert("Employee or UserName Already Exists!");
        setIsLoading(false);
        return;
      } else {
        alert("User Created successfully!");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/userlist");
        }, 1000);
      }

      // navigate("/ToolAuditList");
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
    }
  };

  //#endregion

  return (
    <>
      <div>
        <Typography variant="h5" component="div" mt={1}>
          &nbsp;&nbsp;&nbsp;Create User
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 2,
              width: 700,
              height: 500,
            },
          }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <Paper>
              <Grid
                container
                spacing={3}
                style={{ textAlign: "center" }}
                mt={1}
              >
                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={5}>
                  <TextField
                    fullWidth
                    required
                    id="firstname"
                    label="First Name"
                    variant="outlined"
                    size="small"
                    value={firstnamevalue}
                    onChange={(event) => setFirstnamevalue(event.target.value)}
                    error={interacted && firstnamevalue === ""}
                    helperText={
                      interacted && firstnamevalue === ""
                        ? "Enter First Name"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={4}>
                  <TextField
                    fullWidth
                    required
                    id="lastname"
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    value={lastnamevalue}
                    onChange={(event) => setLastnamevalue(event.target.value)}
                    error={interacted && lastnamevalue === ""}
                    helperText={
                      interacted && lastnamevalue === ""
                        ? "Enter Last Name"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={5}>
                  <TextField
                    fullWidth
                    required
                    id="username"
                    label="User Name"
                    variant="outlined"
                    size="small"
                    value={usernamevalue}
                    onChange={(event) => setusernamevalue(event.target.value)}
                    error={interacted && usernamevalue === ""}
                    helperText={
                      interacted && usernamevalue === ""
                        ? "Enter User Name"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={4}>
                  <FormControl variant="outlined" fullWidth size="small">
                    {interacted && passwordvalue === "" ? (
                      <InputLabel
                        style={{ textAlign: "center", color: "red" }}
                        required
                      >
                        Password
                      </InputLabel>
                    ) : (
                      <InputLabel style={{ textAlign: "center" }} required>
                        Password
                      </InputLabel>
                    )}

                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      value={passwordvalue}
                      onChange={(event) => setPasswordvalue(event.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      error={interacted && passwordvalue === ""}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {interacted && passwordvalue === ""
                        ? "Enter Password"
                        : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={5}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    variant="outlined"
                    size="small"
                    type="email"
                    value={emailvalue}
                    onChange={(event) => setEmailvalue(event.target.value)}
                    error={!isValidEmail(emailvalue) && emailvalue !== ""}
                    helperText={
                      !isValidEmail(emailvalue) && emailvalue !== ""
                        ? "Invalid email address"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={4}>
                  <TextField
                    fullWidth
                    id="mobileno"
                    label="Mobile No."
                    variant="outlined"
                    size="small"
                    value={mobilevalue}
                    onChange={(event) => {
                      const numericValue = event.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      const limitedValue = numericValue.slice(0, 10);
                      setmobilevalue(limitedValue);
                    }}
                    error={
                      mobilevalue !== null &&
                      mobilevalue !== "" &&
                      mobilevalue.length !== 10
                    }
                    helperText={
                      mobilevalue !== null &&
                      mobilevalue !== "" &&
                      mobilevalue.length !== 10
                        ? "Enter Valid Mobile Number"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={5}>
                  {DD && DD.roles ? (
                    <Autocomplete
                      disablePortal
                      clearIcon={null}
                      id="Role"
                      size="small"
                      options={DD.roles.map((item) => ({
                        label: item.roleName,
                        value: item.roleID,
                      }))}
                      value={rolevalue}
                      onChange={(event, newValue) => {
                        setrolevalue(newValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          required
                          variant="outlined"
                          error={interacted && rolevalue === null}
                          helperText={
                            interacted && rolevalue === null
                              ? "Select Role"
                              : ""
                          }
                        />
                      )}
                    />
                  ) : (
                    <Skeleton variant="rounded" height={38} />
                  )}
                </Grid>
                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={4}>
                  {DD && DD.deptList ? (
                    <Autocomplete
                      clearIcon={null}
                      disablePortal
                      id="combo-box-demo"
                      options={DD.deptList.map((item) => ({
                        label: item.departmentName,
                        value: item.departmentID,
                      }))}
                      value={department}
                      onChange={(e, newValue) => setDepartment(newValue)}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
                          required
                          error={interacted && department === null}
                          helperText={
                            interacted && department === null
                              ? "Select Department"
                              : ""
                          }
                        />
                      )}
                      size="small"
                    />
                  ) : (
                    <Skeleton variant="rounded" height={38} />
                  )}
                </Grid>

                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={5}>
                  <TextField
                    fullWidth
                    required
                    id="employeeID"
                    label="Employee ID"
                    variant="outlined"
                    size="small"
                    value={employeeIDvalue}
                    onChange={(event) => setemployeeIDvalue(event.target.value)}
                    error={interacted && employeeIDvalue === ""}
                    helperText={
                      interacted && employeeIDvalue === ""
                        ? "Enter Employee ID"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} ml={4}>
                  <TextField
                    fullWidth
                    required
                    id="employeeID"
                    label="Designation"
                    variant="outlined"
                    size="small"
                    value={designationvalue}
                    onChange={(event) =>
                      setDesignationvalue(event.target.value)
                    }
                    error={interacted && designationvalue === ""}
                    helperText={
                      interacted && designationvalue === ""
                        ? "Enter Designation"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    onClick={handleSubmit}
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </div>
    </>
  );
}

export default UserCreate;
