import React, { useState, useRef, useEffect } from "react";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  TextField,
  Grid,
  Box,
  Autocomplete,
  Avatar,
  Button,
  Skeleton,
  IconButton,
  InputAdornment,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import UploadedConfirmed from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useParams } from "react-router-dom";
import axios from "axios";
function UserUpdate() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion
  const navigate = useNavigate();
  const roleID = localStorage.getItem("roleID");

  //Get API For DropDowns
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);

  // #region Field Values
  const [interacted, setInteracted] = useState(false);
  const [department, setDepartment] = useState("");
  const [firstnamevalue, setFirstnamevalue] = useState("");
  const [lastnamevalue, setLastnamevalue] = useState("");
  const [employeeIDvalue, setemployeeIDvalue] = useState("");
  const [usernamevalue, setusernamevalue] = useState("");
  const [passwordvalue, setPasswordvalue] = useState("");
  const [emailvalue, setEmailvalue] = useState("");
  const [mobilevalue, setmobilevalue] = useState("");
  const [rolevalue, setrolevalue] = useState("");
  const [userID, setuserID] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [UploadedIcon, setUploadedIcon] = useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [GetFileName, setGetFileName] = useState();
  const [unchangedrole, setunchangedrole] = useState("");
  const [unchangeddepartment, setunchangeddepartment] = useState("");
  const [isActivevalue, setisActivevalue] = useState(false);
  const [designationvalue, setdesignationvalue] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // #endregion

  //#region Attachment
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger a click event on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    console.log("SSSS", e.target.files[0]);
    if (e.target.files[0].size < 1048576) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setUploadedIcon(true);
    } else {
      alert("Upload an image with in 1 MB");
    }
  };
  const deleteAttachment = () => {
    setFile();
    setFileName("");
    setUploadedIcon(false);
  };

  //#endregion

  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (id !== "") {
      fetch(`${BASE_API_URL_Web}GetUserProfile/` + id)
        .then((res) => res.json())
        .then((resp) => {
          setFirstnamevalue(resp.firstName);
          setLastnamevalue(resp.lastName);
          setusernamevalue(resp.userName);
          setPasswordvalue(resp.password);
          setEmailvalue(resp.emailAddress);
          setmobilevalue(resp.mobileNo);
          setemployeeIDvalue(resp.employeeID);
          setrolevalue(resp.role);
          setDepartment(resp.departID);
          setuserID(resp.userID);
          setGetFileName(resp.userImage);
          setFile(resp.userProfileImage);
          setisActivevalue(resp.isActive);
          setdesignationvalue(resp.designation);
          console.log(resp);
          setunchangedrole(resp.role || 0);
          setunchangeddepartment(resp.departID || 0);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    if (GetFileName !== "" && GetFileName !== null && GetFileName) {
      const fetchImage = async () => {
        try {
          console.log("file:", GetFileName);

          const response = await fetch(
            `${BASE_API_URL_Web}UserImage?fileName=${GetFileName}`
          );

          if (response.ok) {
            const blob = await response.blob();
            setImageUrl(URL.createObjectURL(blob));
          } else {
            console.error("Error getting image: ", response.status);
          }
        } catch (error) {
          console.error("Error getting image: ", error);
          alert("Image Not Found");
        }
      };

      fetchImage();
    }
  }, [id, GetFileName]);

  //#region submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const role =
      rolevalue.roleID !== undefined ? rolevalue.roleID : unchangedrole;
    const departmentvalue =
      rolevalue.departmentID !== undefined
        ? rolevalue.departmentID
        : unchangeddepartment;

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

    console.log(file);
    const formData = new FormData();
    formData.append("userProfileImage", file ? file : null);
    formData.append("userImage", fileName ? fileName : GetFileName);
    formData.append("firstName", firstnamevalue);
    formData.append("lastName", lastnamevalue);
    formData.append("employeeID", employeeIDvalue);
    formData.append("userName", usernamevalue);
    formData.append("password", passwordvalue);
    if (emailvalue !== null && emailvalue !== "") {
      formData.append("emailAddress", emailvalue);
    }
    if (mobilevalue !== null && mobilevalue !== "") {
      formData.append("mobileNo", mobilevalue);
    }
    formData.append("role", role);
    formData.append("departID", departmentvalue);
    formData.append("userID", userID);
    if (designationvalue !== null && designationvalue !== "") {
      formData.append("designation", designationvalue);
    }
    formData.append("isActive", isActivevalue);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_API_URL_Web}UserUpdate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Updated Successfully", res);

      if (res.data.errorMessage === "UserName Already Exists") {
        alert("Employee or UserName Already Exists!");
        setIsLoading(false);
        return;
      } else {
        alert("Updated successfully!");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/userlist");
        }, 1000);
      }
    } catch (ex) {
      console.log(ex);
      setIsLoading(false);
      alert("Update Failed");
    }
  };
  //#endregion

  const Cancel = () => {
    navigate("/toolrequest");
  };

  const isValidEmail = (email) => {
    // Regular expression for a simple email validation (ending with "@gmail.com")
    const emailRegex = /\S+@gmail\.com$/i;
    return email === "" || emailRegex.test(email);
  };

  return (
    <>
      <div>
        <Typography variant="h5" component="div" mt={1}>
          &nbsp;&nbsp;&nbsp;Update User
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 900,
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
                alignItems="center"
                justifyContent="center"
                marginLeft={5}
              >
                <Grid item>
                  <Box>
                    <Paper
                      style={{ width: 200, height: 200, marginBottom: 50 }}
                    >
                      {imageUrl && file === null ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          style={{ width: 200, height: 200 }}
                        />
                      ) : (
                        <>
                          {file ? (
                            <div>
                              {file.type.startsWith("image") ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Selected File"
                                  style={{ width: 200, height: 200 }}
                                />
                              ) : (
                                <a
                                  href={URL.createObjectURL(file)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View File
                                </a>
                              )}
                            </div>
                          ) : (
                            <Avatar
                              variant="square"
                              style={{ width: 200, height: 200 }}
                            />
                          )}
                        </>
                      )}
                    </Paper>
                    <div>
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title="Upload photo"
                        onClick={handleButtonClick}
                      >
                        <AddAPhotoIcon
                          style={{ position: "fixed", paddingLeft: 60 }}
                        />
                        <br />
                        <br />
                        <div>
                          <p
                            style={{
                              position: "fixed",
                              textAlign: "center",
                              width: 200,
                            }}
                          >
                            {UploadedIcon ? fileName : GetFileName}
                          </p>
                        </div>
                        {UploadedIcon ? (
                          <>
                            <UploadedConfirmed sx={{ color: "#10EF13" }} />
                          </>
                        ) : (
                          <>
                            <UploadedConfirmed sx={{ color: "white" }} />
                            <DeleteIcon sx={{ color: "white" }} />
                          </>
                        )}
                      </button>
                      <input
                        type="file"
                        accept=".jpg, .png, .jpeg"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                      />
                      {UploadedIcon ? (
                        <DeleteIcon
                          onClick={deleteAttachment}
                          sx={{ color: "red" }}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </Box>
                </Grid>
                <Grid
                  item
                  sm
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                >
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    <TextField
                      fullWidth
                      id="firstname"
                      label="First Name"
                      variant="outlined"
                      size="small"
                      value={firstnamevalue}
                      onChange={(event) =>
                        setFirstnamevalue(event.target.value)
                      }
                      error={interacted && firstnamevalue === ""}
                      helperText={
                        interacted && firstnamevalue === ""
                          ? "Enter First Name"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    <TextField
                      fullWidth
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

                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    <TextField
                      fullWidth
                      id="username"
                      label="Username"
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

                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
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
                        onChange={(event) =>
                          setPasswordvalue(event.target.value)
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
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

                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
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
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
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
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    {DD.roles && DD.roles.length > 0 ? (
                      <Autocomplete
                        clearIcon={null}
                        disabled={roleID !== "3"}
                        size="small"
                        disablePortal
                        options={DD.roles}
                        value={
                          DD.roles.find(
                            (option) => option.roleID === rolevalue
                          ) || ""
                        }
                        onChange={(event, newValue) => setrolevalue(newValue)}
                        getOptionLabel={(option) =>
                          option.roleName || rolevalue.roleName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value || ""
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Role"
                            variant="outlined"
                            error={interacted && rolevalue === null}
                            helperText={
                              interacted && rolevalue === null
                                ? "Select Role"
                                : ""
                            }
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>{option.roleName}</li>
                        )}
                      />
                    ) : (
                      <Skeleton variant="rounded" height={38} />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    {DD.deptList && DD.deptList.length > 0 ? (
                      <Autocomplete
                        clearIcon={null}
                        disabled={roleID !== "3"}
                        size="small"
                        disablePortal
                        options={DD.deptList}
                        value={
                          DD.deptList.find(
                            (option) => option.departmentID === department
                          ) || ""
                        }
                        onChange={(event, newValue) => setDepartment(newValue)}
                        getOptionLabel={(option) =>
                          option.departmentName ||
                          department.departmentName ||
                          ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value || ""
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            variant="outlined"
                            error={interacted && department === null}
                            helperText={
                              interacted && department === null
                                ? "Select Department"
                                : ""
                            }
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>{option.departmentName}</li>
                        )}
                      />
                    ) : (
                      <Skeleton variant="rounded" height={38} />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    <TextField
                      fullWidth
                      id="employeeID"
                      label="Employee ID"
                      variant="outlined"
                      size="small"
                      value={employeeIDvalue}
                      onChange={(event) =>
                        setemployeeIDvalue(event.target.value)
                      }
                      error={interacted && employeeIDvalue === ""}
                      helperText={
                        interacted && employeeIDvalue === ""
                          ? "Enter Employee ID"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4.5} md={4.5} lg={4.5} xl={4.5}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Designation"
                      variant="outlined"
                      size="small"
                      type="email"
                      value={designationvalue}
                      onChange={(event) =>
                        setdesignationvalue(event.target.value)
                      }
                      error={interacted && designationvalue === ""}
                      helperText={
                        interacted && designationvalue === ""
                          ? "Enter Designation"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4} ml={5}>
                    <label style={{ fontSize: "16px" }}>
                      <input
                        type="checkbox"
                        style={{ width: "15px", height: "15px" }}
                        checked={isActivevalue}
                        onChange={() => setisActivevalue(!isActivevalue)}
                      />
                      &nbsp; Is Active
                    </label>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}></Grid>
                  <br />
                  <br />
                  <Grid
                    item
                    xs={12}
                    sm={3.5}
                    md={3.5}
                    lg={3.5}
                    xl={3.5}
                    ml={16}
                  >
                    <Button
                      variant="extended"
                      size="medium"
                      color="secondary"
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    >
                      Update
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="extended"
                      size="medium"
                      color="secondary"
                      style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                      onClick={Cancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={2} md={2} lg={2} xl={2}></Grid>
                  <br />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </div>
    </>
  );
}

export default UserUpdate;
