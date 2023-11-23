import React, { useState, useEffect } from "react";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Fab,
  MenuItem,
  Autocomplete,
  TextField,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import UpdateIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

//import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Loading from "./Loading";

function ToolScheduler() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //const navigate = useNavigate();
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
  const { data: ScheduleList } = useApi(`${BASE_API_URL_Web}ToolScheduleList`);

  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  //#region Fields in table

  const [Frequency, setFrequency] = useState([]);
  useEffect(() => {
    if (ScheduleList) {
      // Map the frequency values from ScheduleList to the Frequency state
      const initialFrequencyValues = ScheduleList.map((row) => row.frequencyID);
      setFrequency(initialFrequencyValues);
    }
  }, [ScheduleList]);
  const handleFrequency = (event, index) => {
    const newValue = event.target.value;
    // Create a new array with the updated value for the specified row
    const newFrequencyValues = [...Frequency];
    newFrequencyValues[index] = newValue;
    setFrequency(newFrequencyValues);
  };

  const [Inspect, setInspect] = useState([]);
  useEffect(() => {
    if (ScheduleList) {
      // Map the frequency values from ScheduleList to the Frequency state
      const initialInspectValues = ScheduleList.map(
        (row) => row.inspectionTypeID
      );
      setInspect(initialInspectValues);
    }
  }, [ScheduleList]);
  const handleInspectType = (event, index) => {
    const newValue = event.target.value;
    // Create a new array with the updated value for the specified row
    const newDropdownValues = [...Inspect];
    newDropdownValues[index] = newValue;
    setInspect(newDropdownValues);
  };

  const [NextInspectionDate, setNextInspectionDate] = useState([]);
  useEffect(() => {
    if (ScheduleList) {
      const nextInspectionDates = ScheduleList.map((row) => {
        if (row.nextInspectionDate) {
          const parts = row.nextInspectionDate.split("/");
          if (parts.length === 3) {
            const day = parts[0].padStart(2, "0");
            const month = parts[1].padStart(2, "0");
            const year = parts[2];
            const isoDate = `${year}-${month}-${day}`;
            return isoDate;
          }
        }
        return null;
      });
      setNextInspectionDate(nextInspectionDates);
    }
  }, [ScheduleList]);

  const [NextInspectionDateFormatted, setNextInspectionDateFormatted] =
    useState([]);
  const handleinspectiondate = (event, index) => {
    const newValue = event.target.value;

    const date = new Date(newValue);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const updatedValues = [...NextInspectionDate];
    updatedValues[index] = newValue;
    setNextInspectionDate(updatedValues);

    const updatedValuesFormatted = [...NextInspectionDateFormatted];
    updatedValuesFormatted[index] = formattedDate;
    setNextInspectionDateFormatted(updatedValuesFormatted);
  };

  const [InspectionEngg, setInspectionEngg] = useState([]);
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  useEffect(() => {
    if (ScheduleList) {
      // Map the frequency values from ScheduleList to the Frequency state
      const initialInspectionEnggValues = ScheduleList.map(
        (row) => row.inspectionEngineer
      );
      setInspectionEngg(initialInspectionEnggValues);
    }
  }, [ScheduleList]);
  const handleInspectionEngg = (event, index) => {
    const newValue = event.target.value;
    setInspectionEngg((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      return updatedValues;
    });
  };

  const [Remarks, setRemarks] = useState([]);
  useEffect(() => {
    if (ScheduleList) {
      // Map the frequency values from ScheduleList to the Frequency state
      const initialRemarksValues = ScheduleList.map((row) => row.remarks);
      setRemarks(initialRemarksValues);
    }
  }, [ScheduleList]);
  const handleRemarks = (event, index) => {
    const newValue = event.target.value;
    const newRemarks = [...Remarks];
    newRemarks[index] = newValue;
    setRemarks(newRemarks);
  };
  //#endregion

  const [editMode, setEditMode] = useState(
    Array(ScheduleList.length).fill(false)
  );

  const handleEditClick = (row, index) => {
    // Toggle the edit mode for the clicked row
    setEditMode((prevEditMode) => {
      const newEditMode = [...prevEditMode];
      newEditMode[index] = true;
      return newEditMode;
    });
  };

  const handleSave = async (row, index) => {
    //#region
    if (!Frequency[index]) {
      alert("Select Frequency.");
      return;
    }

    if (!Inspect[index]) {
      alert("Select Inspection Type.");
      return;
    }
    if (!NextInspectionDate[index]) {
      alert("Select Next Inspection Date.");
      return;
    }
    if (!InspectionEngg[index]) {
      alert("Select Inspection Engineer.");
      return;
    }

    //#endregion

    console.log(NextInspectionDate[index]);
    const date = new Date(NextInspectionDate[index]);
    // Format the date as 'dd/MM/yyyy'
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const editdata = {
      scid: row.scid,
      frequencyID: Frequency[index] ? Frequency[index] : 0,
      inspectionTypeID: Inspect[index] ? Inspect[index] : 0,
      nextInspectionDate: formattedDate ? formattedDate : null,
      createdBy: userID,
      remarks: Remarks[index] ? Remarks[index] : "",
      inspectionEngineer: InspectionEngg[index] ? InspectionEngg[index] : 0,
    };

    try {
      console.log("Edited Data:", editdata);

      const response = await fetch(`${BASE_API_URL_Web}ScheduleInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editdata),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (${response.status} - ${response.statusText})`
        );
      }

      const data = await response.json();
      console.log("Data received from API:", data);
      alert("Inspection Updated");
    } catch (error) {
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
    }

    setEditMode((prevEditMode) => {
      const newEditMode = [...prevEditMode];
      newEditMode[index] = false;
      return newEditMode;
    });
  };

  const handleCancel = (row, index) => {
    setEditMode((prevEditMode) => {
      const newEditMode = [...prevEditMode];
      newEditMode[index] = false;
      return newEditMode;
    });
  };

  //#region Search Filter
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedInspectionEngg, setSelectedInspectionEngg] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedfrequency, setSelectedfrequency] = useState(null);
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
      toolType: selectedToolType ? selectedToolType.value : 0,
      inspectionEngineer: selectedInspectionEngg
        ? selectedInspectionEngg.value
        : 0,
      frequencyID: selectedfrequency ? selectedfrequency.value : 0,
      fromDate: formattedFromDate !== "NaN/NaN/NaN" ? formattedFromDate : null,
      toDate: formattedtoDate !== "NaN/NaN/NaN" ? formattedtoDate : null,
    };
    setIsLoading(true);
    try {
      console.log("formData:", formData);

      const response = await fetch(`${BASE_API_URL_Web}SearchScheduler`, {
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

  //#region Filter Fields in table

  const [FilterFrequency, setFilterFrequency] = useState([]);
  useEffect(() => {
    if (FilterData) {
      // Map the frequency values from FilterData to the Frequency state
      const initialFrequencyValues = FilterData.map((row) => row.frequencyID);
      setFilterFrequency(initialFrequencyValues);
    }
  }, [FilterData]);
  const handleFilterFrequency = (event, index) => {
    const newValue = event.target.value;
    // Create a new array with the updated value for the specified row
    const newFrequencyValues = [...FilterFrequency];
    newFrequencyValues[index] = newValue;
    setFilterFrequency(newFrequencyValues);
  };

  const [FilterInspect, setFilterInspect] = useState([]);
  useEffect(() => {
    if (FilterData) {
      // Map the frequency values from FilterData to the Frequency state
      const initialInspectValues = FilterData.map(
        (row) => row.inspectionTypeID
      );
      setFilterInspect(initialInspectValues);
    }
  }, [FilterData]);
  const handleFilterInspectType = (event, index) => {
    const newValue = event.target.value;
    // Create a new array with the updated value for the specified row
    const newDropdownValues = [...FilterInspect];
    newDropdownValues[index] = newValue;
    setFilterInspect(newDropdownValues);
  };

  const [FilterNextInspectionDate, setFilterNextInspectionDate] = useState([]);
  useEffect(() => {
    if (FilterData) {
      const nextInspectionDates = FilterData.map((row) => {
        if (row.nextInspectionDate) {
          const parts = row.nextInspectionDate.split("/");
          if (parts.length === 3) {
            const day = parts[0].padStart(2, "0");
            const month = parts[1].padStart(2, "0");
            const year = parts[2];
            const isoDate = `${year}-${month}-${day}`;
            return isoDate;
          }
        }
        return null;
      });
      setFilterNextInspectionDate(nextInspectionDates);
    }
  }, [FilterData]);

  const [
    FilterNextInspectionDateFormatted,
    setFilterNextInspectionDateFormatted,
  ] = useState([]);
  const handleFilterinspectiondate = (event, index) => {
    const newValue = event.target.value;

    const date = new Date(newValue);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const updatedValues = [...FilterNextInspectionDate];
    updatedValues[index] = newValue;
    setFilterNextInspectionDate(updatedValues);

    const updatedValuesFormatted = [...FilterNextInspectionDateFormatted];
    updatedValuesFormatted[index] = formattedDate;
    setFilterNextInspectionDateFormatted(updatedValuesFormatted);
  };

  const [FilterInspectionEngg, setFilterInspectionEngg] = useState([]);
  useEffect(() => {
    if (FilterData) {
      // Map the frequency values from FilterData to the Frequency state
      const initialInspectionEnggValues = FilterData.map(
        (row) => row.inspectionEngineer
      );
      setFilterInspectionEngg(initialInspectionEnggValues);
    }
  }, [FilterData]);
  const handleFilterInspectionEngg = (event, index) => {
    const newValue = event.target.value;
    setFilterInspectionEngg((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      return updatedValues;
    });
  };

  const [FilterRemarks, setFilterRemarks] = useState([]);
  useEffect(() => {
    if (FilterData) {
      // Map the frequency values from FilterData to the Frequency state
      const initialRemarksValues = FilterData.map((row) => row.remarks);
      setFilterRemarks(initialRemarksValues);
    }
  }, [FilterData]);
  const handleFilterRemarks = (event, index) => {
    const newValue = event.target.value;
    const newRemarks = [...Remarks];
    newRemarks[index] = newValue;
    setFilterRemarks(newRemarks);
  };
  //#endregion

  //#endregion

  return (
    <>
      {/* Search */}
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool Scheduler
      </Typography>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={0.1} md={0.1} lg={0.1} xl={0.1} mt={1}></Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={12} md={1.8} lg={1.8} xl={1.8} mt={1}>
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

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5} mt={1}>
          <TextField
            label="From Date"
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

        <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5} mt={1}>
          <TextField
            label="To Date"
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

        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
          &nbsp;&nbsp;&nbsp;
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
      <br />
      <Grid container spacing={2} sx={{ maxHeight: "330px" }}>
        <Grid container spacing={0}></Grid>
      </Grid>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isFilter ? (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer sx={{ maxHeight: "68vh", overflowY: "scroll" }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  style={{ minWidth: 800 }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 70,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Action
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 50,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        SC-ID
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 170,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Plant Name
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 170,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 200,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Tool Tag ID - Name
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Frequency
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Inspection Type
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Next Inspection Date
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 250,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Inspection Engineer
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 250,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Remarks
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {FilterData &&
                      FilterData.map((row, index) => (
                        <TableRow key={row.scid}>
                          <TableCell align="center">
                            {editMode[index] ? (
                              // Render the "Save" icon when in edit mode
                              <>
                                <UpdateIcon
                                  size="large"
                                  color="primary"
                                  onClick={() => handleSave(row, index)}
                                  style={{ cursor: "pointer" }}
                                />
                                <CancelIcon
                                  size="large"
                                  color="error"
                                  onClick={() => handleCancel(row, index)}
                                  style={{ cursor: "pointer" }}
                                />
                              </>
                            ) : (
                              // Render the "Edit" icon when not in edit mode
                              <EditIcon
                                onClick={() => handleEditClick(row, index)}
                                style={{
                                  cursor: "pointer",
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            )}
                          </TableCell>

                          <TableCell align="left">{row.scid}</TableCell>
                          <TableCell align="left">{row.plantName}</TableCell>
                          <TableCell align="left">{row.toolTypeName}</TableCell>
                          <TableCell align="left">{row.toolName}</TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={FilterFrequency[index] || ""}
                              onChange={(event) =>
                                handleFilterFrequency(event, index)
                              }
                              disabled={!editMode[index]}
                            >
                              <MenuItem disabled value={0}></MenuItem>
                              <MenuItem value={1}>Weekly</MenuItem>
                              <MenuItem value={2}>Bi Weekly</MenuItem>
                              <MenuItem value={3}>Monthly</MenuItem>
                              <MenuItem value={4}>Quarterly</MenuItem>
                              <MenuItem value={5}>Halfyearly</MenuItem>
                              <MenuItem value={6}>Yearly</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={FilterInspect[index] || ""}
                              onChange={(event) =>
                                handleFilterInspectType(event, index)
                              }
                              disabled={!editMode[index]}
                            >
                              <MenuItem disabled value={0}></MenuItem>
                              <MenuItem value={1}>Statutory</MenuItem>
                              <MenuItem value={2}>Internal</MenuItem>
                              <MenuItem value={3}>External</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              id="datetime-picker"
                              type="date"
                              variant="outlined"
                              size="small"
                              value={FilterNextInspectionDate[index] || ""}
                              onChange={(event) =>
                                handleFilterinspectiondate(event, index)
                              }
                              fullWidth
                              disabled={!editMode[index]}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={FilterInspectionEngg[index] || ""}
                              onChange={(event) =>
                                handleFilterInspectionEngg(event, index)
                              }
                              disabled={!editMode[index]}
                              SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    style: {
                                      maxHeight: 350,
                                    },
                                  },
                                },
                              }}
                            >
                              {DD && DD.userList ? (
                                DD.userList.map((user) => (
                                  <MenuItem
                                    key={user.userID}
                                    value={user.userID}
                                  >
                                    {user.userName}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled value={0}>
                                  Loading...
                                </MenuItem>
                              )}
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="text"
                              value={FilterRemarks[index] || ""}
                              size="small"
                              onChange={(event) =>
                                handleFilterRemarks(event, index)
                              }
                              disabled={!editMode[index]}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer sx={{ maxHeight: "68vh", overflowY: "scroll" }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  style={{ minWidth: 800 }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 70,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Action
                      </StyledTableCell>

                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 50,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        SC-ID
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 170,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Plant Name
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 170,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Tool Type
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          minWidth: 200,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Tool Tag ID - Name
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Frequency
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Inspection Type
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 150,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Next Inspection Date
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 250,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Inspection Engineer
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          minWidth: 250,
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Remarks
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {ScheduleList &&
                      ScheduleList.map((row, index) => (
                        <TableRow key={row.scid}>
                          <TableCell align="center">
                            {editMode[index] ? (
                              // Render the "Save" icon when in edit mode
                              <>
                                <UpdateIcon
                                  size="large"
                                  color="primary"
                                  onClick={() => handleSave(row, index)}
                                  style={{ cursor: "pointer" }}
                                />
                                <CancelIcon
                                  size="large"
                                  color="error"
                                  onClick={() => handleCancel(row, index)}
                                  style={{ cursor: "pointer" }}
                                />
                              </>
                            ) : (
                              // Render the "Edit" icon when not in edit mode
                              <EditIcon
                                onClick={() => handleEditClick(row, index)}
                                style={{
                                  cursor: "pointer",
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            )}
                          </TableCell>

                          <TableCell align="left">{row.scid}</TableCell>
                          <TableCell align="left">{row.plantName}</TableCell>
                          <TableCell align="left">{row.toolTypeName}</TableCell>

                          <TableCell align="left">{row.toolName}</TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={Frequency[index] || ""}
                              onChange={(event) =>
                                handleFrequency(event, index)
                              }
                              disabled={!editMode[index]}
                            >
                              <MenuItem disabled value={0}></MenuItem>
                              <MenuItem value={1}>Weekly</MenuItem>
                              <MenuItem value={2}>Bi Weekly</MenuItem>
                              <MenuItem value={3}>Monthly</MenuItem>
                              <MenuItem value={4}>Quarterly</MenuItem>
                              <MenuItem value={5}>Halfyearly</MenuItem>
                              <MenuItem value={6}>Yearly</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={Inspect[index] || ""}
                              onChange={(event) =>
                                handleInspectType(event, index)
                              }
                              disabled={!editMode[index]}
                            >
                              <MenuItem disabled value={0}></MenuItem>
                              <MenuItem value={1}>Statutory</MenuItem>
                              <MenuItem value={2}>Internal</MenuItem>
                              <MenuItem value={3}>External</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              id="datetime-picker"
                              type="date"
                              variant="outlined"
                              size="small"
                              value={NextInspectionDate[index] || ""}
                              onChange={(event) =>
                                handleinspectiondate(event, index)
                              }
                              fullWidth
                              disabled={!editMode[index]}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={InspectionEngg[index] || ""}
                              onChange={(event) =>
                                handleInspectionEngg(event, index)
                              }
                              disabled={!editMode[index]}
                              SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    style: {
                                      maxHeight: 350,
                                    },
                                  },
                                },
                              }}
                            >
                              {DD && DD.userList ? (
                                DD.userList.map((user) => (
                                  <MenuItem
                                    key={user.userID}
                                    value={user.userID}
                                  >
                                    {user.userName}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled value={0}>
                                  Loading...
                                </MenuItem>
                              )}
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="text"
                              value={Remarks[index] || ""}
                              size="small"
                              onChange={(event) => handleRemarks(event, index)}
                              disabled={!editMode[index]}
                            />
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

export default ToolScheduler;
