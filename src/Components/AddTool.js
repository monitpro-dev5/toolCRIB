import React, { useState, useEffect } from "react";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  TextField,
  Grid,
  Container,
  Autocomplete,
  Alert,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function AddTool() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  // Function to get the current date and time and format it
  const userName = localStorage.getItem("userName");
  const userID = localStorage.getItem("userID");

  const [isSaved, setIsSaved] = useState(false);
  //const [apiResponse, setApiResponse] = useState(null);

  const navigate = useNavigate();

  //Get Current Date Time
  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    setCurrentDateTime(getCurrentDateTime());
  }, []);

  //Get API For DropDowns
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);

  // #region Field Values
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedBinNo, setSelectedBinNo] = useState(null);
  const [selectedtooltagID, setselectedtooltagID] = useState(null);

  const [toolNameValue, setToolNameValue] = useState("");
  useEffect(() => {
    if (selectedtooltagID) {
      setToolNameValue(selectedtooltagID);
    } else {
      setToolNameValue("");
    }
  }, [selectedtooltagID]);

  const [dateOfPurchaseValue, setdateOfPurchaseValue] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [approvedByValue, setapprovedByValue] = useState(null);
  const [quantityValue, setquantityValue] = useState("");
  const [isInspectValue, setisInspectValue] = useState(false);
  const [remarksValue, setremarksValue] = useState("");
  // #endregion

  // #region ToolTagID Based on ToolType DD
  const [tooltagID, setTooltagID] = useState([]);
  useEffect(() => {
    if (selectedToolType) {
      // Make the API call using the selectedToolType
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL_Web}GetTagList/${selectedToolType.value}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json(); // Parse the JSON response
          setTooltagID(data); // Update the state with the API data
          console.log(data);
        } catch (error) {
          // Handle errors here
          console.error("API Error:", error);
        }
      };
      // Call the fetchData function
      fetchData();
    }
  }, [selectedToolType]);
  // #endregion

  // Save Button Function
  const handleSave = async () => {
    //Validate form data

    // #region Required Condition
    if (!selectedPlant) {
      alert("Select a plant.");
      return;
    }

    if (!selectedToolType) {
      alert("Select a tool type.");
      return;
    }

    if (!selectedtooltagID) {
      alert("Select a Tool Tag ID.");
      return;
    }
    if (!toolNameValue) {
      alert("Select a Tool Name.");
      return;
    }

    if (!dateOfPurchaseValue) {
      alert("Select a Date of purchase.");
      return;
    }

    if (!approvedByValue) {
      alert("Select a Approved By");
      return;
    }

    if (!quantityValue) {
      alert("Select a Quantity");
      return;
    }

    // #endregion

    // #region Convert date value to a specific format if needed
    //For Date Of Purchase
    const date = new Date(dateOfPurchaseValue);

    // Format the date as 'dd/MM/yyyy HH:mm'
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDateofManufacture = `${day}/${month}/${year} 00:00`;
    // #endregion

    // Create form data object
    const formData = {
      Toolid: 0,
      PlantID: selectedPlant.value,
      ToolTypeID: selectedToolType.value,
      BinNO: selectedBinNo ? selectedBinNo.value : 0,
      TagID: selectedtooltagID,
      ToolName: toolNameValue,
      DateofManufacture: formattedDateofManufacture,
      CreatedBy: userID,
      ApprovedBy: approvedByValue ? approvedByValue.value : null,
      IsInspect: isInspectValue,
      Remarks: remarksValue,
      ToolStatusID: 1,
      Quantity: quantityValue,
    };

    setIsLoading(true);
    try {
      console.log("formData:", formData);

      const response = await fetch(`${BASE_API_URL_Web}AddTool`, {
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

      setIsLoading(false);
      //Response in ALert
      setIsSaved(true);
      //setApiResponse(data);
      setTimeout(() => {
        setIsSaved(false);
        navigate("/toollist");
      }, 3000);
    } catch (error) {
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Add Tool
      </Typography>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <Container>
            <Grid container spacing={2} style={{ textAlign: "center" }} mt={1}>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {DD && DD.plantList ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DD.plantList.map((item) => ({
                      label: item.plantName,
                      value: item.plantID,
                    }))}
                    value={selectedPlant}
                    onChange={(event, newValue) => {
                      setSelectedPlant(newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Plant/Area" />
                    )}
                    size="small"
                  />
                ) : (
                  <Skeleton variant="rounded" height={38} />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {DD && DD.toolTypeList ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DD.toolTypeList.map((item) => ({
                      label: item.ttName,
                      value: item.ttid,
                    }))}
                    value={selectedToolType}
                    onChange={(event, newValue) => {
                      setSelectedToolType(newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Tool Type" />
                    )}
                    size="small"
                  />
                ) : (
                  <Skeleton variant="rounded" height={38} />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {DD && DD.binNOLists ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DD.binNOLists.map((item) => ({
                      label: item.binName,
                      value: item.binID,
                    }))}
                    value={selectedBinNo}
                    onChange={(event, newValue) => {
                      setSelectedBinNo(newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Bin No" />
                    )}
                    size="small"
                  />
                ) : (
                  <Skeleton variant="rounded" height={38} />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                <Autocomplete
                  disablePortal
                  required
                  id="tooltagid"
                  size="small"
                  options={tooltagID.map((option) => option.tagname)}
                  value={selectedtooltagID} // Use the state variable for selected tags
                  onChange={(event, newValue) => {
                    setselectedtooltagID(newValue); // Update the selected tags in state
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tool Tag ID"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => <li {...props}>{option}</li>}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Tool Name"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={toolNameValue}
                  onChange={(event) => setToolNameValue(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                <TextField
                  id="datetime-picker"
                  label="Date Of Purchase"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={dateOfPurchaseValue}
                  onChange={(event) =>
                    setdateOfPurchaseValue(event.target.value)
                  }
                  size="small"
                  fullWidth
                />
              </Grid>
              <br />
              <br />
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Created By"
                  variant="outlined"
                  size="small"
                  required
                  disabled
                  value={userName}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Created Date Time"
                  variant="outlined"
                  size="small"
                  disabled
                  value={currentDateTime}
                  onChange={(event) => setCurrentDateTime(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
                {DD && DD.userList ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DD.userList
                      .filter(
                        (item) =>
                          item.userID !== parseInt(userID, 10) &&
                          (item.roleID === 11 || item.roleID === 5)
                      )
                      .map((item) => ({
                        label: item.userName,
                        value: item.userID,
                      }))}
                    value={approvedByValue}
                    onChange={(event, newValue) => {
                      setapprovedByValue(newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Approved By" />
                    )}
                    size="small"
                  />
                ) : (
                  <Skeleton variant="rounded" height={38} />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Quantity"
                  variant="outlined"
                  size="small"
                  value={quantityValue}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(
                      /[^0-9]/g,
                      ""
                    ); // Replace non-numeric characters with an empty string
                    const limitedValue = numericValue.slice(0, 2);
                    setquantityValue(limitedValue);
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={2}>
                <label style={{ fontSize: "16px" }}>
                  <input
                    type="checkbox"
                    checked={isInspectValue}
                    onChange={() => setisInspectValue(!isInspectValue)}
                    style={{ width: "15px", height: "15px" }}
                  />
                  &nbsp;Is Inspect
                </label>
              </Grid>

              <Grid item xs={12} sm={12} md={8} lg={8} xl={8} mt={1}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Remarks"
                  variant="outlined"
                  size="small"
                  value={remarksValue}
                  onChange={(event) => setremarksValue(event.target.value)}
                />
              </Grid>

              <br />
              <br />

              <Grid item md={3} lg={3} xl={3}></Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  variant="extended"
                  size="medium"
                  color="secondary"
                  onClick={handleSave}
                  style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                >
                  Submit
                </Button>
              </Grid>

              <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

              <Grid item xs={12} md={8} lg={8} xl={8} mt={1}>
                {isSaved && (
                  <Alert severity="success" onClose={() => setIsSaved(false)}>
                    Created Successfully
                  </Alert>
                )}
              </Grid>

              <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

              <br />
            </Grid>
          </Container>
        )}
      </div>
    </>
  );
}

export default AddTool;
