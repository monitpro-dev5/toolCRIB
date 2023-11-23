import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  Container,
  Autocomplete,
  Alert,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import useApi, { BASE_API_URL_Web } from "../API/api";

export default function UpdateTool() {
  //const userName = localStorage.getItem("userName");
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();

  //#region Loading
  const [isLoading, setIsLoading] = useState(false);

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

  const [isSaved, setIsSaved] = useState(false);

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);

  // #region Field Values
  const [ToolID, setToolID] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedToolType, setSelectedToolType] = useState("");
  const [isToolTypeChange, setisToolTypeChange] = useState(false);
  const [selectedBinNo, setSelectedBinNo] = useState("");

  const [selectedtooltagID, setselectedtooltagID] = useState("");
  const [disabledToolTagID, setdisabledToolTagID] = useState("");

  const [toolNameValue, setToolNameValue] = useState(selectedtooltagID);
  useEffect(() => {
    setToolNameValue(selectedtooltagID);
  }, [selectedtooltagID]);
  const [disabledToolName, setdisabledToolName] = useState("");

  const [dateOfPurchaseValue, setdateOfPurchaseValue] = useState("");
  const [createdBy, setcreatedBy] = useState("");
  const [createdDateTime, setcreatedDateTime] = useState("");
  const [approvedByValue, setapprovedByValue] = useState("");
  const [isInspectValue, setisInspectValue] = useState(false);
  const [remarksValue, setremarksValue] = useState("");

  const [tooltagID, setTooltagID] = useState([]);
  useEffect(() => {
    if (selectedToolType && selectedToolType.ttid !== undefined) {
      // Make the API call using the selectedToolType
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL_Web}GetTagList/${selectedToolType.ttid}`
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

  //#endregion

  //#region Unchanged Values
  const [unchangedPlant, setunchangedPlant] = useState("");
  const [unchangedToolType, setunchangedToolType] = useState("");
  const [unchangedBinNo, setunchangedBinNo] = useState("");
  const [unchangedTagID, setunchangedTagID] = useState("");
  const [unchangedToolName, setunchangedToolName] = useState("");
  const [unchangedDateOM, setunchangedDateOM] = useState("");
  const [unchangedApprovedBy, setunchangedApprovedBy] = useState("");
  const [unchangedStatusID, setunchangedStatusID] = useState("");

  //#endregion

  const { id } = useParams();
  useEffect(() => {
    fetch(`${BASE_API_URL_Web}GetTool/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp);
        setToolID(resp.toolid);
        setSelectedPlant(resp.plantID);
        setSelectedToolType(resp.toolTypeID);
        if (resp.binNO !== "") {
          setSelectedBinNo(resp.binNO);
        }

        setdisabledToolTagID(resp.tagID);
        setdisabledToolName(resp.toolName);

        setdisabledToolTagID
          ? setisToolTypeChange(true)
          : setisToolTypeChange(false);

        if (resp.dateofManufacture !== "") {
          const [datePart] = resp.dateofManufacture.split(" "); // Split date and time parts
          const [day, month, year] = datePart.split("/"); // Split day, month, and year
          const parsedGateOutDate = `${year}-${month}-${day}`;
          setdateOfPurchaseValue(parsedGateOutDate);
        }

        setcreatedBy(resp.createdByName);
        setcreatedDateTime(resp.createdDateTime);
        setapprovedByValue(resp.approvedBy);
        setisInspectValue(resp.isInspect);
        setremarksValue(resp.remarks);

        //#region Unchanged Values
        setunchangedPlant(resp.plantID);
        setunchangedToolType(resp.toolTypeID);
        setunchangedBinNo(resp.binNO);
        setunchangedTagID(resp.tagID);
        setunchangedToolName(resp.toolName);
        setunchangedDateOM(resp.dateofManufacture);
        setunchangedApprovedBy(resp.approvedBy);
        setunchangedStatusID(resp.toolStatusID);
        //#endregion
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  // Save Button Function
  const handleSave = async () => {
    // #region Convert date value to a specific format if needed
    //For Date Of Purchase
    const date = new Date(dateOfPurchaseValue);

    // Format the date as 'dd/MM/yyyy HH:mm'
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDateofManufacture = `${day}/${month}/${year} 00:00`;
    // #endregion

    const plantID =
      selectedPlant.plantID !== undefined
        ? selectedPlant.plantID
        : unchangedPlant;
    const toolTypeID = selectedToolType.ttid
      ? selectedToolType.ttid
      : unchangedToolType;
    const binNO = selectedBinNo.binID ? selectedBinNo.binID : unchangedBinNo;
    const approvedBy = approvedByValue.userID
      ? approvedByValue.userID
      : unchangedApprovedBy;

    // Create form data object
    const formData = {
      Toolid: ToolID,

      PlantID: plantID,
      ToolTypeID: toolTypeID,
      BinNO: binNO,
      TagID: selectedtooltagID ? selectedtooltagID : unchangedTagID,
      ToolName: toolNameValue ? toolNameValue : unchangedToolName,
      DateofManufacture: dateOfPurchaseValue
        ? formattedDateofManufacture
        : unchangedDateOM,
      CreatedBy: userID,
      ApprovedBy: approvedBy,
      IsInspect: isInspectValue,
      Remarks: remarksValue,
      toolStatusID: 1,
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

  // Delete Button Function
  const handleDeleteRequest = async () => {
    // #region Convert date value to a specific format if needed
    //For Date Of Purchase
    const date = new Date(dateOfPurchaseValue);

    // Format the date as 'dd/MM/yyyy HH:mm'
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDateofManufacture = `${day}/${month}/${year} 00:00`;
    // #endregion

    const plantID =
      selectedPlant.plantID !== undefined
        ? selectedPlant.plantID
        : unchangedPlant;
    const toolTypeID = selectedToolType.ttid
      ? selectedToolType.ttid
      : unchangedToolType;
    const binNO = selectedBinNo.binID ? selectedBinNo.binID : unchangedBinNo;
    const approvedBy = approvedByValue.userID
      ? approvedByValue.userID
      : unchangedApprovedBy;

    // Create form data object
    const formData = {
      Toolid: ToolID,

      PlantID: plantID,
      ToolTypeID: toolTypeID,
      BinNO: binNO,
      TagID: selectedtooltagID ? selectedtooltagID : unchangedTagID,
      ToolName: toolNameValue ? toolNameValue : unchangedToolName,
      DateofManufacture: dateOfPurchaseValue
        ? formattedDateofManufacture
        : unchangedDateOM,
      CreatedBy: userID,
      ApprovedBy: approvedBy,
      IsInspect: isInspectValue,
      Remarks: remarksValue,
      toolStatusID: 8,
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
        &nbsp;&nbsp;&nbsp;Update Tool
      </Typography>

      {isLoading ? (
        <div style={backgroundImageStyle}>
          <Box style={formContainerStyle}>
            <CircularProgress size={50} />
          </Box>
        </div>
      ) : (
        <Container>
          <Grid container spacing={2} style={{ textAlign: "center" }} mt={1}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {DD.plantList && DD.plantList.length > 0 && (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  id="plantid"
                  size="small"
                  options={DD.plantList}
                  value={
                    DD.plantList.find(
                      (option) => option.plantID === selectedPlant
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.plantName || selectedPlant.plantName || ""
                  }
                  onChange={(event, newValue) => {
                    setSelectedPlant(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Plant/Area"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.plantName}</li>
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {DD.toolTypeList && DD.toolTypeList.length > 0 && (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  id="tooltypeid"
                  size="small"
                  options={DD.toolTypeList}
                  value={
                    DD.toolTypeList.find(
                      (option) => option.ttid === selectedToolType
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.ttName || selectedToolType.ttName || ""
                  }
                  onChange={(event, newValue) => {
                    setSelectedToolType(newValue);
                    setisToolTypeChange(false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tool Type"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.ttName}</li>
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {DD.binNOLists && DD.binNOLists.length > 0 && (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  id="binno"
                  size="small"
                  options={DD.binNOLists}
                  value={
                    DD.binNOLists.find(
                      (option) => option.binID === selectedBinNo
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.binName || selectedBinNo.binName || ""
                  }
                  onChange={(event, newValue) => {
                    setSelectedBinNo(newValue);
                    setdisabledToolTagID(false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Bin No" variant="outlined" />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <li {...props}>{option.binName}</li>
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              {isToolTypeChange ? (
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Tool Tag ID"
                  variant="outlined"
                  size="small"
                  disabled
                  value={disabledToolTagID}
                />
              ) : (
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
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tool Tag ID"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => <li {...props}>{option}</li>}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              {isToolTypeChange ? (
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Tool Tag ID"
                  variant="outlined"
                  size="small"
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={disabledToolName}
                />
              ) : (
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
              )}
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
                onChange={(event) => setdateOfPurchaseValue(event.target.value)}
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
                value={createdBy}
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
                value={createdDateTime}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              {DD.userList && DD.userList.length > 0 && (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  id="approvedby"
                  size="small"
                  options={DD.userList.filter(
                    (item) =>
                      item.userID !== parseInt(userID, 10) &&
                      (item.roleID === 11 || item.roleID === 5)
                  )}
                  value={
                    DD.userList.find(
                      (option) => option.userID === approvedByValue
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.userName || approvedByValue.userName || ""
                  }
                  onChange={(event, newValue) => {
                    setapprovedByValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Approved By"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.userName}</li>
                  )}
                />
              )}
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

            <Grid item xs={12} sm={12} md={10} lg={10} xl={10} mt={1}>
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {unchangedStatusID === 2 || unchangedStatusID === 8 ? (
                <Button
                  variant="extended"
                  size="medium"
                  color="secondary"
                  onClick={handleDeleteRequest}
                  style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                >
                  Delete Request
                </Button>
              ) : (
                <span></span>
              )}
            </Grid>

            <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

            <Grid item xs={12} md={8} lg={8} xl={8} mt={1}>
              {isSaved && (
                <Alert severity="success" onClose={() => setIsSaved(false)}>
                  Updated Successfully
                </Alert>
              )}
            </Grid>

            <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

            <br />
          </Grid>
        </Container>
      )}
    </>
  );
}
