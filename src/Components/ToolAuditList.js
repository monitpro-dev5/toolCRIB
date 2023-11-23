import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import useApi, { BASE_API_URL_Web } from "../API/api";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Autocomplete,
  TextField,
  Fab,
  Grid,
  Typography,
  IconButton,
  Skeleton,
  styled,
  tableCellClasses,
} from "@mui/material";

function ToolAuditList() {
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

  const roleID = localStorage.getItem("roleID");
  const userName = localStorage.getItem("userName");

  const [employeevalue, setemployeevalue] = useState(null);
  const [departmentvalue, setdepartmentvalue] = useState(null);
  const [contractorvalue, setcontractorvalue] = useState(null);
  const [fromaudit, setfromaudit] = useState("");
  const [toaudit, settoaudit] = useState("");

  const navigate = useNavigate();
  const handleEditClick = (id) => {
    navigate("/toolauditform/" + id);
  };

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  const { data: auditList } = useApi(`${BASE_API_URL_Web}AuditList`);
  //console.log(auditList);

  //#region formatteddate for fromaudit and toaudit
  let formattedDate = "";
  if (fromaudit) {
    const now = new Date(fromaudit);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  }
  let formattedtoDate = "";
  if (toaudit) {
    const now = new Date(toaudit);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedtoDate = `${day}/${month}/${year}`;
  }
  //#endregion

  //#region search
  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  const handleSave = async () => {
    const formData = {
      employeeID: employeevalue ? employeevalue.value : 0,
      contractorID: contractorvalue ? contractorvalue.value : 0,
      departmentID: departmentvalue ? departmentvalue.value : 0,
      fromDate: formattedDate,
      toDate: formattedtoDate,
    };
    try {
      console.log("formData:", formData);
      const response = await fetch(`${BASE_API_URL_Web}SearchAuditList`, {
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
    } catch (error) {
      alert("Under Process");
      console.error("Error:", error);
    }
    //#endregion
  };

  return (
    <div>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool Audit List
      </Typography>

      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.userList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.userList.map((item) => ({
                label: item.userName,
                value: item.userID,
              }))}
              value={employeevalue}
              onChange={(event, newValue) => {
                setemployeevalue(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Employee Name" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.deptList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.deptList.map((item) => ({
                label: item.departmentName,
                value: item.departmentID,
              }))}
              value={departmentvalue}
              onChange={(event, newValue) => {
                setdepartmentvalue(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" height={38} />
          )}
        </Grid>
        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {DD && DD.contractorList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.contractorList.map((item) => ({
                label: item.companyName,
                value: item.contractID,
              }))}
              value={contractorvalue}
              onChange={(event, newValue) => {
                setcontractorvalue(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Contractor" />
              )}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" height={38} />
          )}
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          <TextField
            label="from (audit date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={fromaudit}
            onChange={(event) => setfromaudit(event.target.value)}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          <TextField
            label="To (audit date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={toaudit}
            onChange={(event) => settoaudit(event.target.value)}
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
            onClick={handleSave}
          >
            <SearchIcon />
          </Fab>
        </Grid>
      </Grid>
      <br></br>

      {isFilter ? (
        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "68vh" }}>
            <Table aria-label="simple table" stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.NO</StyledTableCell>
                  <StyledTableCell align="left">
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left">Department</StyledTableCell>
                  <StyledTableCell align="left">No Of Tools</StyledTableCell>
                  <StyledTableCell align="left">Audit Date</StyledTableCell>
                  <StyledTableCell align="left">
                    Next Audit Date
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Tools Damaged/ Not available
                  </StyledTableCell>
                  <StyledTableCell align="left">Audited by</StyledTableCell>
                  <StyledTableCell align="left">Approved by</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FilterData.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{list.conEmpName}</TableCell>
                    <TableCell align="left">{list.departmentName}</TableCell>
                    <TableCell align="center">{list.noOfTools}</TableCell>
                    <TableCell align="left">{list.auditDate}</TableCell>
                    <TableCell align="left">{list.nextAuditDate}</TableCell>
                    <TableCell align="left">{list.lostTools}</TableCell>
                    <TableCell align="left">{list.auditorName}</TableCell>
                    <TableCell align="left">{list.approverName}</TableCell>
                    <TableCell align="center">
                      {roleID === "16" ||
                      roleID === "5" ||
                      roleID === "11" ||
                      list.auditorName.replace(/\s+/g, " ") ===
                        userName.replace(/\s+/g, " ") ? (
                        <IconButton
                          to={`/toolauditform/${list.conEmpID}`}
                          edge="start"
                          color="inherit"
                          aria-label="Edit"
                          id={list.auditID}
                          onClick={() => handleEditClick(list.conEmpID)}
                        >
                          <EditNoteIcon sx={{ color: "#000" }} />
                        </IconButton>
                      ) : null}
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
            <Table aria-label="simple table" stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.NO</StyledTableCell>
                  <StyledTableCell align="left">
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left">Department</StyledTableCell>
                  <StyledTableCell align="left">No Of Tools</StyledTableCell>
                  <StyledTableCell align="left">Audit Date</StyledTableCell>
                  <StyledTableCell align="left">
                    Next Audit Date
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Tools Damaged/ Not available
                  </StyledTableCell>
                  <StyledTableCell align="left">Audited by</StyledTableCell>
                  <StyledTableCell align="left">Approved by</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditList.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{list.conEmpName}</TableCell>
                    <TableCell align="left">{list.departmentName}</TableCell>
                    <TableCell align="center">{list.noOfTools}</TableCell>
                    <TableCell align="left">{list.auditDate}</TableCell>
                    <TableCell align="left">{list.nextAuditDate}</TableCell>
                    <TableCell align="left">{list.lostTools}</TableCell>
                    <TableCell align="left">{list.auditorName}</TableCell>
                    <TableCell align="left">{list.approverName}</TableCell>
                    <TableCell align="center">
                      {roleID === "16" ||
                      roleID === "5" ||
                      roleID === "11" ||
                      list.auditorName.replace(/\s+/g, " ") ===
                        userName.replace(/\s+/g, " ") ? (
                        <IconButton
                          to={`/toolauditform/${list.conEmpID}`}
                          edge="start"
                          color="inherit"
                          aria-label="Edit"
                          id={list.auditID}
                          onClick={() => handleEditClick(list.conEmpID)}
                        >
                          <EditNoteIcon sx={{ color: "#000" }} />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
}

export default ToolAuditList;
