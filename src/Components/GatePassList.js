import React, {
  useState,
  // useEffect, useRef
} from "react";
//import axios from "axios";
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
  //Button,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Loading from "./Loading";
//Import ICONS
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
//import AttachFileIcon from "@mui/icons-material/AttachFile";
import PDFIcon from "@mui/icons-material/PictureAsPdf";
import UploadedConfirmed from "@mui/icons-material/TaskAlt";
//import RequiredFile from "@mui/icons-material/Error";

import { useNavigate } from "react-router-dom";

function GatePassList() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

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

  //const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");
  const RoleID = localStorage.getItem("roleID");

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  const { data: TableData } = useApi(`${BASE_API_URL_Web}GatePassList`);
  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);
  const navigate = useNavigate();

  //#region Search Filter
  const [vendor, setVendor] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [status, setStatus] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  const statusNumbers = [12, 13, 14, 15, 16, 17];

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
      vendorID: vendor ? vendor.value : 0,
      toolType: selectedToolType ? selectedToolType.value : 0,
      gPstatus: status ? status.value : 0,
      fromDate: formattedFromDate !== "NaN/NaN/NaN" ? formattedFromDate : "",
      toDate: formattedtoDate !== "NaN/NaN/NaN" ? formattedtoDate : "",
    };
    setIsLoading(true);

    try {
      console.log("formData:", formData);

      const response = await fetch(`${BASE_API_URL_Web}SearchGatePass`, {
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

  const handleUpdateGatePass = (id) => {
    navigate("/gatepassupdate/" + id);
  };

  const handlePDF = (id) => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      // If the new tab was successfully opened, navigate in the new tab
      newTab.location.href = "/pdf/" + id;
    }
  };

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Gate Pass List
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.vendorList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.vendorList.map((item) => ({
                label: item.vendorName,
                value: item.vendorID,
              }))}
              value={vendor}
              onChange={(event, newValue) => {
                setVendor(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => <TextField {...params} label="Vendor" />}
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
              value={status}
              onChange={(event, newValue) => {
                setStatus(newValue);
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

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
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

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={1}>
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
                      <StyledTableCell align="center">S.No</StyledTableCell>
                      <StyledTableCell align="left">GP.No</StyledTableCell>
                      <StyledTableCell align="left">Vendor</StyledTableCell>
                      <StyledTableCell align="left">Tool Type</StyledTableCell>
                      <StyledTableCell align="left">
                        Tool ID & Name
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Gate Out Date
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Returnable Date
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        Submitted By
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        Approved By
                      </StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{ minWidth: 70, padding: "8px" }}
                      >
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {FilterData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="left">{rowData.gpid}</TableCell>
                        <TableCell align="left">{rowData.vendorName}</TableCell>
                        <TableCell align="left">{rowData.toolType}</TableCell>
                        <TableCell align="left">{rowData.toolName}</TableCell>
                        <TableCell align="left">
                          {rowData.gateOutDate}
                        </TableCell>
                        <TableCell align="left">{rowData.returnDate}</TableCell>
                        <TableCell align="left">
                          {rowData.createdByName}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.approverName}
                        </TableCell>
                        <TableCell align="left">{rowData.gpStatus}</TableCell>
                        <TableCell align="center">
                          {rowData.gpStatus === "GP-Draft" && (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Approve"
                            >
                              <EditNoteIcon />
                            </button>
                          )}
                          {rowData.gpStatus === "GP-Submitted" &&
                          rowData.approverName === userName ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "GP-Approved" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "Material Dispatched" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "Material Received" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "GP-Closed" && (
                            <button
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Gate Pass Closed"
                            >
                              <UploadedConfirmed sx={{ color: "#10EF13" }} />
                            </button>
                          )}
                          <PDFIcon
                            sx={{ color: "#F01414" }}
                            onClick={() => handlePDF(rowData.gpid)}
                            style={{ cursor: "pointer", width: 10, height: 10 }}
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
              <TableContainer sx={{ maxHeight: "68vh" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" width={1}>
                        S.No
                      </StyledTableCell>
                      <StyledTableCell align="left">GP.No</StyledTableCell>
                      <StyledTableCell align="left">Vendor</StyledTableCell>
                      <StyledTableCell align="left">Tool Type</StyledTableCell>
                      <StyledTableCell align="left">
                        Tool ID & Name
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Gate Out Date
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Returnable Date
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        Submitted By
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        Approved By
                      </StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{ minWidth: 70, padding: "8px" }}
                      >
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {TableData.map((rowData, index) => (
                      <TableRow key={index} hover>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="left">{rowData.gpid}</TableCell>
                        <TableCell align="left">{rowData.vendorName}</TableCell>
                        <TableCell align="left">{rowData.toolType}</TableCell>
                        <TableCell align="left">{rowData.toolName}</TableCell>
                        <TableCell align="left">
                          {rowData.gateOutDate}
                        </TableCell>
                        <TableCell align="left">{rowData.returnDate}</TableCell>
                        <TableCell align="left">
                          {rowData.createdByName}
                        </TableCell>
                        <TableCell align="left">
                          {rowData.approverName}
                        </TableCell>
                        <TableCell align="left">{rowData.gpStatus}</TableCell>
                        <TableCell align="center">
                          {rowData.gpStatus === "GP-Draft" &&
                            (rowData.createdByName === userName ||
                              rowData.approverName === userName ||
                              RoleID === "16") && (
                              <button
                                onClick={() =>
                                  handleUpdateGatePass(rowData.gpid)
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                title="Approve"
                              >
                                <EditNoteIcon />
                              </button>
                            )}
                          {rowData.gpStatus === "GP-Submitted" &&
                          rowData.approverName === userName ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "GP-Approved" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "Material Dispatched" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "Material Received" &&
                          RoleID === "16" ? (
                            <button
                              onClick={() => handleUpdateGatePass(rowData.gpid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                              title="Close"
                            >
                              <EditNoteIcon />
                            </button>
                          ) : (
                            <span></span>
                          )}

                          {rowData.gpStatus === "GP-Closed" && (
                            <button
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                              }}
                              title="Gate Pass Closed"
                            >
                              <UploadedConfirmed sx={{ color: "#10EF13" }} />
                            </button>
                          )}
                          &nbsp;
                          <PDFIcon
                            sx={{ color: "#F01414" }}
                            onClick={() => handlePDF(rowData.gpid)}
                            style={{ cursor: "pointer"}}
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

export default GatePassList;
