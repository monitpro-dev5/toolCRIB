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
  Typography,
  Fab,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
//import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import Loading from "./Loading";
import CircularProgress from "@mui/material/CircularProgress";
//import { useNavigate } from "react-router-dom";

function InspectionHistory() {
  //const userID = localStorage.getItem("userID");

  // Loading
  const [isLoading, setIsLoading] = useState(false);

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
  const { data: TableData } = useApi(`${BASE_API_URL_Web}InspectionHistory`);
  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);
  // For Edit tool get API
  //const [getToolList, setgetToolList] = useState([]);

  //const navigate = useNavigate();

  //#region Approved

  // const singleApprove = async (toolID) => {
  //   console.log("SC-ID:", toolID);
  //   console.log("Status:", 1);
  //   console.log("Modified By:", userID);
  // };

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

      const response = await fetch(
        `${BASE_API_URL_Web}SearchInspectionHistory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

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
      alert("Dynamic Load Content Failed ");
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  //#endregion

  //#region Download
  const [downloadStates, setDownloadStates] = useState(
    TableData.map(() => false)
  );

  const handleDownload = async (attachment, index) => {
    const fileName = attachment;

    setDownloadStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = true;
      return updatedStates;
    });
    console.log("after click", downloadStates);
    try {
      const response = await fetch(
        `${BASE_API_URL_Web}files?fileName=${fileName}`
      );

      const data = await response.blob();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      setDownloadStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = false;
        return updatedStates;
      });
      console.log("after download", downloadStates);

      console.log("Successfull Response");
    } catch (error) {
      console.error("Error downloading file: ", error);
      alert("Dynamic Content Load Failed");

      setDownloadStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = false;
        return updatedStates;
      });
    }
  };
  //#endregion

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Inspection History
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
            label="From Date (Last Inspection Date)"
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
            label="To Date (Last Inspection Date)"
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
                      <StyledTableCell align="center" width={1}>
                        SCID
                      </StyledTableCell>
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

                      <StyledTableCell align="center" width={20}>
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
                        <TableCell align="center">
                          {rowData.attachment !== "null" ? (
                            <>
                              {true === false ? (
                                <button
                                  onClick={() =>
                                    handleDownload(rowData.attachment)
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                  }}
                                  title={rowData.attachment}
                                >
                                  <DownloadIcon sx={{ color: "#2C7EDA" }} />
                                </button>
                              ) : (
                                <CircularProgress
                                  size={20}
                                  style={{ marginBottom: "3px" }}
                                />
                              )}
                            </>
                          ) : (
                            <span></span>
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
              <TableContainer sx={{ maxHeight: "58vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" width={1}>
                        SCID
                      </StyledTableCell>
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

                      <StyledTableCell align="center" width={20}>
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
                        <TableCell align="center">
                          {rowData.attachment !== "null" ? (
                            <>
                              {!downloadStates[index] ? (
                                <button
                                  onClick={() =>
                                    handleDownload(rowData.attachment, index)
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                  }}
                                  title={rowData.attachment}
                                >
                                  <DownloadIcon sx={{ color: "#2C7EDA" }} />
                                </button>
                              ) : (
                                <CircularProgress
                                  size={20}
                                  style={{ marginBottom: "3px" }}
                                />
                              )}
                            </>
                          ) : (
                            <span></span>
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

export default InspectionHistory;
