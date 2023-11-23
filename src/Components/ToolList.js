import React, { useState } from "react";
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
  //AppBar,
  //Toolbar,
  Typography,
  Fab,
  Skeleton,
} from "@mui/material";
//import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import UploadedConfirmed from "@mui/icons-material/TaskAlt";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function ToolList() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion
  const userID = localStorage.getItem("userID");
  const RoleID = localStorage.getItem("roleID");

  // const LightTheme = createTheme({
  //   palette: {
  //     mode: "light",
  //     primary: {
  //       main: "#fff",
  //     },
  //   },
  // });
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

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  const { data: TableData } = useApi(`${BASE_API_URL_Web}ToolList`);

  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  const navigate = useNavigate();

  //#region Approved

  //#region Selected CheckBox
  const [selectedToolIDs, setSelectedToolIDs] = useState([]);
  const [selectedDeleteToolIDs, setSelectedDeleteToolIDs] = useState([]);

  const handleCheckboxChange = (rowData) => {
    // Check if the rowData.toolID is already in the selectedToolIDs array
    if (selectedToolIDs.includes(rowData.toolID)) {
      // If it's already selected, remove it
      setSelectedToolIDs((prevSelectedToolIDs) =>
        prevSelectedToolIDs.filter((id) => id !== rowData.toolID)
      );
    } else {
      // If it's not selected, add it
      setSelectedToolIDs((prevSelectedToolIDs) => [
        ...prevSelectedToolIDs,
        rowData.toolID,
      ]);
    }
  };

  const handleDeleteCheckboxChange = (rowData) => {
    // Check if the rowData.toolID is already in the selectedToolIDs array
    if (selectedDeleteToolIDs.includes(rowData.toolID)) {
      // If it's already selected, remove it
      setSelectedDeleteToolIDs((prevSelectedToolIDs) =>
        prevSelectedToolIDs.filter((id) => id !== rowData.toolID)
      );
    } else {
      // If it's not selected, add it
      setSelectedDeleteToolIDs((prevSelectedToolIDs) => [
        ...prevSelectedToolIDs,
        rowData.toolID,
      ]);
    }
  };

  //#endregion

  const handleButtonClick = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to approve the tool addition?"
    );

    if (isConfirmed) {
      console.log("Selected Tool IDs:", selectedToolIDs);
      const approveddata = {
        toolID: selectedToolIDs,
        approverID: userID,
      };
      setIsLoading(true);
      try {
        console.log("Approved:", approveddata);

        const response = await fetch(`${BASE_API_URL_Web}AddToolApprove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(approveddata),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok (${response.status} - ${response.statusText})`
          );
        }

        const data = await response.json();
        console.log("Data received from API:", data);
        alert("Tool Addition Approved Successfully!");
        window.location.reload();
        setIsLoading(false);
      } catch (error) {
        alert("Dynamic Load Content Failed");
        setIsLoading(false);
        console.error("Error:", error);
      }
      // Perform your desired action with the selectedToolIDs
      setSelectedToolIDs([]);
    } else {
      alert("Tool Addition Cancelled.");
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the tool?"
    );

    if (isConfirmed) {
      console.log("Selected Tool IDs:", selectedDeleteToolIDs);
      const Deleteddata = {
        toolID: selectedDeleteToolIDs,
        approverID: parseInt(userID, 10),
      };
      setIsLoading(true);
      try {
        console.log("Approved:", Deleteddata);

        const response = await fetch(`${BASE_API_URL_Web}ToolDelete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Deleteddata),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok (${response.status} - ${response.statusText})`
          );
        }

        const data = await response.json();
        console.log("Data received from API:", data);
        alert("Tool Deleted Successfully!");
        window.location.reload();
        setIsLoading(false);
      } catch (error) {
        alert("Dynamic Load Content Failed");
        setIsLoading(false);
        console.error("Error:", error);
      }
      // Perform your desired action with the selectedToolIDs
      setSelectedToolIDs([]);
    } else {
      alert("Tool Deletion Cancelled.");
    }
  };

  //#endregion

  //#region Search Filter
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedBinNo, setSelectedBinNo] = useState(null);
  const [searchStatus, setsearchStatus] = useState(null);
  const [ApprovedBy, setApprovedBy] = useState(null);

  const statusNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const handleSearch = async () => {
    const formData = {
      plantID: selectedPlant ? selectedPlant.value : 0,
      toolTypeID: selectedToolType ? selectedToolType.value : 0,
      binNO: selectedBinNo ? selectedBinNo.value : 0,
      statusID: searchStatus ? searchStatus.value : 0,
      approvedBy: ApprovedBy ? ApprovedBy.value : 0,
    };
    setIsLoading(true);
    try {
      console.log("formData:", formData);
      const response = await fetch(`${BASE_API_URL_Web}SearchToolList`, {
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
      console.log("Filter Data received from API:", data);
      setFilterData(data);
      setisFilter(true);
      setIsLoading(false);
    } catch (error) {
      alert("Dynamic Load Content Failed");
      setIsLoading(false);
      console.error("Error:", error);
    }
  };
  //#endregion

  const handleUpdateTool = (id) => {
    navigate("/updatetool/" + id);
  };

  return (
    <>
      {/* <ThemeProvider theme={LightTheme}>
        <AppBar position="static">
          {" "}
          <Toolbar variant="dense">
            <Typography variant="h5" color="WHITE" component="div">
              Edit Scheduler List
            </Typography>{" "}
          </Toolbar>{" "}
        </AppBar>
      </ThemeProvider> */}
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool List
      </Typography>

      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs={12} sm={0.1} md={0.1} lg={0.1} xl={0.1} mt={1}></Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={1.8} md={1.8} lg={1.8} xl={1.8} mt={1}>
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
              renderInput={(params) => <TextField {...params} label="Bin No" />}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.userList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.userList.map((item) => ({
                label: item.userName,
                value: item.userID,
              }))}
              value={ApprovedBy}
              onChange={(event, newValue) => {
                setApprovedBy(newValue);
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

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.statusList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.statusList
                .filter((item) => statusNumbers.includes(item.statusID))
                .map((item) => ({
                  label: item.statusName,
                  value: item.statusID,
                }))}
              value={searchStatus}
              onChange={(event, newValue) => {
                setsearchStatus(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => <TextField {...params} label="Status" />}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
          <Fab
            size="medium"
            color="secondary"
            style={{ backgroundColor: "#2C7EDA" }}
            title="Search"
            onClick={handleSearch}
          >
            <SearchIcon />
          </Fab>
          &nbsp; &nbsp; &nbsp;
          {selectedToolIDs.length > 0 && (
            <Fab
              size="medium"
              color="secondary"
              style={{ backgroundColor: "#3DD518" }}
              title="Approve"
              onClick={handleButtonClick}
            >
              <DoneIcon />
            </Fab>
          )}
          &nbsp; &nbsp; &nbsp;
          {selectedDeleteToolIDs.length > 0 && (
            <Fab
              size="medium"
              color="secondary"
              style={{ backgroundColor: "#F01414" }}
              title="Delete"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </Fab>
          )}
        </Grid>
      </Grid>

      <br />
      <Box sx={{ borderBottom: 3, borderColor: "divider" }}></Box>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isFilter ? (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer sx={{ maxHeight: "68vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left" width={1}>
                        S.No
                      </StyledTableCell>
                      <StyledTableCell align="left" width={180}>
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={80}>
                        Tool ID
                      </StyledTableCell>
                      <StyledTableCell align="left" width={90}>
                        Tool Name
                      </StyledTableCell>
                      <StyledTableCell align="left" width={220}>
                        Plant Area
                      </StyledTableCell>
                      <StyledTableCell align="left" width={60}>
                        Bin No
                      </StyledTableCell>
                      <StyledTableCell align="left" width={120}>
                        Purchase Date
                      </StyledTableCell>
                      <StyledTableCell align="left" width={80}>
                        Is Inspect
                      </StyledTableCell>
                      <StyledTableCell align="left" width={100}>
                        Approved By
                      </StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>

                      <StyledTableCell align="left" width={50}>
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {FilterData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">
                          {rowData.toolTypeName}
                        </TableCell>
                        <TableCell align="left">{rowData.tagID}</TableCell>
                        <TableCell align="left">{rowData.toolName}</TableCell>
                        <TableCell align="left">{rowData.plantName}</TableCell>
                        <TableCell align="left">{rowData.binName}</TableCell>
                        <TableCell align="left">
                          {rowData.dateofManufacture}
                        </TableCell>
                        {rowData.isInspect === "Y" ? (
                          <TableCell align="left">Yes</TableCell>
                        ) : (
                          <TableCell align="left">No</TableCell>
                        )}
                        <TableCell align="left">
                          {rowData.approverName}
                        </TableCell>
                        <TableCell align="left">{rowData.statusName}</TableCell>
                        <TableCell align="left">
                          {rowData.statusName === "Draft" &&
                          selectedDeleteToolIDs.length === 0 &&
                          rowData.approvedByID === parseInt(userID, 10) ? (
                            <input
                              type="checkbox"
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                              onChange={() => handleCheckboxChange(rowData)}
                              checked={selectedToolIDs.includes(rowData.toolID)}
                            />
                          ) : rowData.statusID === 8 &&
                            selectedToolIDs.length === 0 &&
                            rowData.approvedByID === parseInt(userID, 10) ? (
                            <input
                              type="checkbox"
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                              onChange={() =>
                                handleDeleteCheckboxChange(rowData)
                              }
                              checked={selectedDeleteToolIDs.includes(
                                rowData.toolID
                              )}
                            />
                          ) : (
                            <span></span>
                          )}
                          {rowData.statusName === "Draft" ? (
                            <button
                              onClick={() => handleUpdateTool(rowData.toolID)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <EditNoteIcon />
                            </button>
                          ) : rowData.statusName === "Active" &&
                            RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateTool(rowData.toolID)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <EditNoteIcon />
                            </button>
                          ) : rowData.statusID === 8 ? (
                            <span></span>
                          ) : (
                            <UploadedConfirmed
                              sx={{ color: "#10EF13", marginRight: "7px" }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer component={Paper} sx={{ maxHeight: "68vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left" width={1}>
                        S.No
                      </StyledTableCell>
                      <StyledTableCell align="left" width={180}>
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell align="left" width={80}>
                        Tool ID
                      </StyledTableCell>
                      <StyledTableCell align="left" width={90}>
                        Tool Name
                      </StyledTableCell>
                      <StyledTableCell align="left" width={220}>
                        Plant Area
                      </StyledTableCell>
                      <StyledTableCell align="left" width={60}>
                        Bin No
                      </StyledTableCell>
                      <StyledTableCell align="left" width={120}>
                        Purchase Date
                      </StyledTableCell>
                      <StyledTableCell align="left" width={80}>
                        Is Inspect
                      </StyledTableCell>
                      <StyledTableCell align="left" width={100}>
                        Approved By
                      </StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>

                      <StyledTableCell align="left" width={50}>
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {TableData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">
                          {rowData.toolTypeName}
                        </TableCell>
                        <TableCell align="left">{rowData.tagID}</TableCell>
                        <TableCell align="left">{rowData.toolName}</TableCell>
                        <TableCell align="left">{rowData.plantName}</TableCell>
                        <TableCell align="left">{rowData.binName}</TableCell>
                        <TableCell align="left">
                          {rowData.dateofManufacture}
                        </TableCell>
                        {rowData.isInspect === "Y" ? (
                          <TableCell align="left">Yes</TableCell>
                        ) : (
                          <TableCell align="left">No</TableCell>
                        )}
                        <TableCell align="left">
                          {rowData.approverName}
                        </TableCell>
                        <TableCell align="left">{rowData.statusName}</TableCell>
                        <TableCell align="left">
                          {/* For Checkbox */}
                          {rowData.statusName === "Draft" &&
                          selectedDeleteToolIDs.length === 0 &&
                          rowData.approvedByID === parseInt(userID, 10) ? (
                            <input
                              type="checkbox"
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                              onChange={() => handleCheckboxChange(rowData)}
                              checked={selectedToolIDs.includes(rowData.toolID)}
                            />
                          ) : rowData.statusID === 8 &&
                            selectedToolIDs.length === 0 &&
                            rowData.approvedByID === parseInt(userID, 10) ? (
                            <input
                              type="checkbox"
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                              onChange={() =>
                                handleDeleteCheckboxChange(rowData)
                              }
                              checked={selectedDeleteToolIDs.includes(
                                rowData.toolID
                              )}
                            />
                          ) : (
                            <span></span>
                          )}

                          {/* For Edit Button */}
                          {rowData.statusName === "Draft" &&
                          (rowData.approvedByID === parseInt(userID, 10) ||
                            RoleID === "16") ? (
                            <button
                              onClick={() => handleUpdateTool(rowData.toolID)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <EditNoteIcon />
                            </button>
                          ) : rowData.statusName === "Active" &&
                            RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateTool(rowData.toolID)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <EditNoteIcon />
                            </button>
                          ) : rowData.statusID === 8 ? (
                            <span></span>
                          ) : (
                            <UploadedConfirmed
                              sx={{ color: "#10EF13", marginRight: "7px" }}
                            />
                          )}
                        </TableCell>
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

export default ToolList;
