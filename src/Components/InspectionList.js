import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  Autocomplete,
  Grid,
  TextField,
  Box,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Fab,
  Button,
  Modal,
  Skeleton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Loading from "./Loading";
//Import ICONS
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Logout";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import XIcon from "@mui/icons-material/Close";
import UploadedConfirmed from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

//import FactoryIcon from "@mui/icons-material/Factory";
import { useNavigate } from "react-router-dom";

function InspectionList() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  const LightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#2C7EDA",
      },
    },
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#2C7EDA",
      color: "white",
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");
  const RoleID = localStorage.getItem("roleID");

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  const { data: TableData } = useApi(`${BASE_API_URL_Web}InspectionList`);
  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);
  const navigate = useNavigate();

  //#region PopUP

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);

  const [SCIDpop, setSCIDpop] = useState("");
  const [ToolTagpop, setToolTagpop] = useState("");
  const [ToolNamepop, setToolNamepop] = useState("");
  const [NextInspectionpop, setNextInspectionpop] = useState("");
  const [Remarkspop, setRemarkspop] = useState("");
  const [Datepop, setDatepop] = useState("");

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [UploadedIcon, setUploadedIcon] = useState(false);

  //#region Date Validation
  const [maxDate, setMaxDate] = useState(getTodayDate());

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    setMaxDate(getTodayDate());
  }, []);
  //#endregion

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
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUploadedIcon(true);
  };

  //#endregion

  const CloseInspection = async (rowData) => {
    setOpen(true);
    setSCIDpop(rowData.scid);
    setNextInspectionpop(rowData.nextInspectionDate);
    setToolTagpop(rowData.tagID);
    setToolNamepop(rowData.toolTypeName);
  };

  const ClosePop = () => {
    setOpen(false);
    setOpenStatutory(false);
  };
  const handleClose = async (e) => {
    const approvedData = {
      SCID: SCIDpop,
      InspectionDate: Datepop,
      Comments: Remarkspop,
    };
    console.log("Approved Data: ", approvedData);

    const date = new Date(Datepop);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDatePop = `${day}/${month}/${year}`;

    //File Attachment
    console.log(file);
    const formData = new FormData();
    formData.append("formFile", file ? file : null);
    formData.append("fileName", fileName ? fileName : null);
    formData.append("scid", SCIDpop);
    formData.append("inspectionDate", formattedDatePop);
    formData.append("inspectededBy", userID);
    formData.append("remarks", Remarkspop ? Remarkspop : null);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const res = await axios.post(
        `${BASE_API_URL_Web}InspectionSave`,
        formData
      );

      console.log("Inspection Closed Successfully", res);
      alert("Inspection Closed Successfully");

      setSCIDpop("");
      setNextInspectionpop("");
      setDatepop("");
      setRemarkspop("");
      setOpen(false);
      setUploadedIcon(false);
      window.location.reload();
    } catch (ex) {
      console.log(ex);
      alert("Dynamic Load Content Failed");
    }
  };

  const deleteAttachment = () => {
    setFile();
    setFileName("");
    setUploadedIcon(false);
  };

  //#endregion

  //#region Statutory PopUP

  const styleStatutory = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 100,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [openStatutory, setOpenStatutory] = React.useState(false);
  const CloseStatutoryInspection = async (rowData) => {
    console.log(rowData);
    setSCIDpop(rowData.scid);
    setNextInspectionpop(rowData.nextInspectionDate);
    setToolTagpop(rowData.tagID);
    setToolNamepop(rowData.toolTypeName);
    setOpenStatutory(true);
  };

  const StatutoryCloseInternal = () => {
    setOpenStatutory(false);
    setOpen(true);
  };

  const StatutoryCloseExternal = (scid) => {
    navigate("/gatepass/" + scid);
  };
  //#endregion

  //#region Search Filter
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedInspectionEngg, setSelectedInspectionEngg] = useState(null);
  const [selectedfrequency, setSelectedfrequency] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedInspect, setSelectedInspect] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  const SearchFilter = async () => {
    //#region Format the date as 'dd/MM/yyyy HH:mm'
    const fromdate = new Date(selectedFromDate);

    const fromday = fromdate.getDate().toString().padStart(2, "0");
    const frommonth = (fromdate.getMonth() + 1).toString().padStart(2, "0");
    const fromyear = fromdate.getFullYear();

    const formattedFromDate = `${fromday}/${frommonth}/${fromyear}`;

    const todate = new Date(selectedToDate);

    const today = todate.getDate().toString().padStart(2, "0");
    const tomonth = (todate.getMonth() + 1).toString().padStart(2, "0");
    const toyear = todate.getFullYear();

    const formattedtoDate = `${today}/${tomonth}/${toyear}`;
    //#endregion

    const formData = {
      plantID: selectedPlant ? selectedPlant.value : 0,
      inspectionEngineer: selectedInspectionEngg
        ? selectedInspectionEngg.value
        : 0,
      frequencyID: selectedfrequency ? selectedfrequency.value : 0,
      toolType: selectedToolType ? selectedToolType.value : 0,
      inspectionTypeID: selectedInspect ? selectedInspect.value : 0,
      fromDate: formattedFromDate !== "NaN/NaN/NaN" ? formattedFromDate : null,
      toDate: formattedtoDate !== "NaN/NaN/NaN" ? formattedtoDate : null,
    };
    setIsLoading(true);
    try {
      console.log("formData:", formData);

      const response = await fetch(`${BASE_API_URL_Web}SearchInspection`, {
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
      setFilterData(data);
      setisFilter(true);
      setIsLoading(false);
    } catch (error) {
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  //#endregion

  //#region External

  const handleExternal = (id) => {
    navigate("/gatepass/" + id);
  };
  //#endregion

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Inspection List
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} mt={1}>
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
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} mt={1}>
          {DD && DD.frequencyLists ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.frequencyLists.map((item) => ({
                label: item.frequencyName,
                value: item.frequencyID,
              }))}
              value={selectedfrequency}
              onChange={(event, newValue) => {
                setSelectedfrequency(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Frequency" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} mt={1}>
          {DD && DD.userList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.userList.map((item) => ({
                label: item.userName,
                value: item.userID,
              }))}
              value={selectedInspectionEngg}
              onChange={(event, newValue) => {
                setSelectedInspectionEngg(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Inspection Engineer" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}></Grid>

        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
        <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5} mt={1}>
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
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5} mt={1}>
          {DD && DD.inspectionType ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.inspectionType.map((item) => ({
                label: item.inspectionName,
                value: item.inspectionTypeID,
              }))}
              value={selectedInspect}
              onChange={(event, newValue) => {
                setSelectedInspect(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Inspection Type" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
          <TextField
            label="From Date (Next Inspection Date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={selectedFromDate}
            onChange={(event) => setSelectedFromDate(event.target.value)}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
          <TextField
            label="To Date (Next Inspection Date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={selectedToDate}
            onChange={(event) => setSelectedToDate(event.target.value)}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Fab
            size="medium"
            color="secondary"
            style={{ backgroundColor: "#2C7EDA" }}
            title="Search"
            onClick={SearchFilter}
          >
            <SearchIcon />
          </Fab>
        </Grid>
      </Grid>

      <br />
      <Box sx={{ borderBottom: 3, borderColor: "divider" }}></Box>

      {/* POP UP START */}
      <>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} xl={12}>
                <ThemeProvider theme={LightTheme}>
                  <AppBar position="static">
                    <Toolbar variant="dense">
                      <div style={{ flex: "1" }}>
                        <Typography variant="h5" color="white" component="div">
                          Close Inspection
                        </Typography>
                      </div>
                      <div style={{ flex: "1", textAlign: "center" }}>
                        <Typography variant="h5" color="white" component="div">
                          SCID - {SCIDpop}
                        </Typography>
                      </div>
                      <div
                        style={{ flex: "1", textAlign: "right", marginTop: 10 }}
                      >
                        <Typography variant="h5" color="white" component="div">
                          <XIcon
                            onClick={ClosePop}
                            style={{ cursor: "pointer" }}
                          />
                        </Typography>
                      </div>
                      <br></br>
                    </Toolbar>
                  </AppBar>
                </ThemeProvider>
              </Grid>

              <Grid item xs={12} md={6} lg={6} xl={6}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Tool ID : {ToolTagpop}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Tool Type : {ToolNamepop}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} lg={6} xl={6}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Next Inspection : {NextInspectionpop}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} lg={6} xl={6}>
                <TextField
                  id="date-picker"
                  label="Inspection Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={Datepop}
                  onChange={(event) => setDatepop(event.target.value)}
                  size="small"
                  fullWidth
                  inputProps={{ max: maxDate }}
                />
              </Grid>

              <Grid item xs={12} md={12} lg={12} xl={12}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Comments"
                  variant="outlined"
                  size="small"
                  required
                  multiline
                  rows={3}
                  value={Remarkspop}
                  onChange={(event) => setRemarkspop(event.target.value)}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={1} md={1} lg={1} xl={1} mt={1}></Grid>
              <Grid
                item
                xs={5}
                md={5}
                lg={5}
                xl={5}
                mt={1}
                style={{ textAlign: "center" }}
              >
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  title="Approve"
                  onClick={handleButtonClick}
                >
                  <AttachFileIcon />
                  {UploadedIcon ? (
                    <>
                      <UploadedConfirmed sx={{ color: "#10EF13" }} />
                      {fileName !== "" ? <p>{fileName}</p> : <></>}
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
                  accept="*/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
                {fileName !== "" ? (
                  <DeleteIcon
                    onClick={deleteAttachment}
                    sx={{ color: "red" }}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <DeleteIcon sx={{ color: "white" }} />
                )}
              </Grid>

              <Grid item xs={2} md={2} lg={2} xl={2}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#1e90ff", color: "#fff" }}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Grid>
              <Grid item xs={4} md={4} lg={4} xl={4} mt={1}></Grid>
            </Grid>
          </Box>
        </Modal>
      </>
      {/* POP UP END */}

      {/* POP UP START Statutory */}
      <Modal
        open={openStatutory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleStatutory}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <ThemeProvider theme={LightTheme}>
                <AppBar position="static">
                  <Toolbar variant="dense">
                    <div style={{ flex: "1", textAlign: "left" }}>
                      <Typography variant="h5" color="white" component="div">
                        SCID - {SCIDpop}
                      </Typography>
                    </div>
                    <div
                      style={{ flex: "1", textAlign: "right", marginTop: 10 }}
                    >
                      <Typography variant="h5" color="white" component="div">
                        <XIcon
                          onClick={ClosePop}
                          style={{ cursor: "pointer" }}
                        />
                      </Typography>
                    </div>
                    <br></br>
                  </Toolbar>
                </AppBar>
              </ThemeProvider>
            </Grid>

            <Grid item xs={6} md={6} lg={6} xl={6} mt={1} textAlign={"center"}>
              <Button
                variant="outlined"
                color="success"
                onClick={StatutoryCloseInternal}
              >
                Internal
              </Button>
            </Grid>

            <Grid item xs={6} md={6} lg={6} xl={6} mt={1} textAlign={"center"}>
              <Button
                variant="outlined"
                color="success"
                onClick={() => StatutoryCloseExternal(SCIDpop)}
              >
                External
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* POP UP END Statutory */}

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isFilter ? (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer sx={{ maxHeight: "58vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell align="center" width={1}>SCID</StyledTableCell>
                      <StyledTableCell align="left" width={200}>
                        Plant Name
                      </StyledTableCell>
                      <StyledTableCell align="left" width={200}>
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={120}>
                        Tag ID
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Inspection Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Frequency
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Last Inspection
                      </StyledTableCell>

                      <StyledTableCell align="left" width={50}>
                        Next Inspection
                      </StyledTableCell>

                      <StyledTableCell align="left" width={150}>
                        Inspection Engineer
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        width={20}
                      >
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {FilterData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="center">{rowData.scid}</TableCell>
                        <TableCell align="left">{rowData.plantName}</TableCell>
                        <TableCell align="left">
                          {rowData.toolTypeName}
                        </TableCell>
                        <TableCell align="left">{rowData.tagID}</TableCell>
                        <TableCell align="left">
                          {rowData.inspectionType}
                        </TableCell>
                        <TableCell align="left">{rowData.frequency}</TableCell>
                        <TableCell align="left">
                          {rowData.lastInspectionDate}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.nextInspectionDate}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.inspecEngineerName}
                        </TableCell>
                        {RoleID === "16" ||
                        rowData.inspecEngineerName === userName ? (
                          rowData.inspectionType === "Internal" ? (
                            <TableCell align="center">
                              <button
                                onClick={() => CloseInspection(rowData)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                <CloseIcon sx={{ color: "#10EF13" }} />
                              </button>
                            </TableCell>
                          ) : rowData.inspectionType === "External" &&
                            rowData.gpid === 0 ? (
                            <TableCell align="center">
                              <button
                                onClick={() => handleExternal(rowData.scid)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                <CloseIcon sx={{ color: "red" }} />
                              </button>
                            </TableCell>
                          ) : rowData.inspectionType === "Statutory" ? (
                            <TableCell align="center">
                              <button
                                onClick={() =>
                                  CloseStatutoryInspection(rowData)
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                <CloseIcon sx={{ color: "blue" }} />
                              </button>
                            </TableCell>
                          ) : (
                            <TableCell align="center"></TableCell>
                          )
                        ) : (
                          <TableCell align="center"></TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer sx={{ maxHeight: "58vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" width={1}>SCID</StyledTableCell>
                      <StyledTableCell align="left" width={200}>
                        Plant Name
                      </StyledTableCell>
                      <StyledTableCell align="left" width={200}>
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={120}>
                        Tag ID
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Inspection Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Frequency
                      </StyledTableCell>
                      <StyledTableCell align="left" width={50}>
                        Last Inspection
                      </StyledTableCell>

                      <StyledTableCell align="left" width={50}>
                        Next Inspection
                      </StyledTableCell>

                      <StyledTableCell align="left" width={150}>
                        Inspection Engineer
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        width={20}
                      >
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {TableData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="center">{rowData.scid}</TableCell>
                        <TableCell align="left">{rowData.plantName}</TableCell>
                        <TableCell align="left">
                          {rowData.toolTypeName}
                        </TableCell>
                        <TableCell align="left">{rowData.tagID}</TableCell>
                        <TableCell align="left">
                          {rowData.inspectionType}
                        </TableCell>
                        <TableCell align="left">{rowData.frequency}</TableCell>
                        <TableCell align="left">
                          {rowData.lastInspectionDate}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.nextInspectionDate}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.inspecEngineerName}
                        </TableCell>

                        {RoleID === "16" ||
                        rowData.inspecEngineerName === userName ? (
                          rowData.inspectionType === "Internal" ? (
                            <TableCell align="center">
                              <button
                                onClick={() => CloseInspection(rowData)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                title="Internal"
                              >
                                <CloseIcon sx={{ color: "#10EF13" }} />
                              </button>
                            </TableCell>
                          ) : rowData.inspectionType === "External" &&
                            rowData.gpid === 0 ? (
                            <TableCell align="center">
                              <button
                                onClick={() => handleExternal(rowData.scid)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                title="External"
                              >
                                <CloseIcon sx={{ color: "red" }} />
                              </button>
                            </TableCell>
                          ) : rowData.inspectionType === "Statutory" ? (
                            <TableCell align="center">
                              <button
                                onClick={() =>
                                  CloseStatutoryInspection(rowData)
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                title="Statutory"
                              >
                                <CloseIcon sx={{ color: "blue" }} />
                              </button>
                            </TableCell>
                          ) : (
                            <TableCell align="center"></TableCell>
                          )
                        ) : (
                          <TableCell align="center"></TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </>
  );
}

export default InspectionList;
