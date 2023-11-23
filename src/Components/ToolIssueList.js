import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import { BASE_API_URL_Web } from "../API/api";
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
  Skeleton,
  styled,
  tableCellClasses,
} from "@mui/material";

function IssueList() {
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

  const userName = localStorage.getItem("userName");
  const roleID = localStorage.getItem("roleID");

  const idsToShow = [3, 4, 5, 10, 11];
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate("/updaterequestform/" + id);
  };

  const [data, setdata] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_API_URL_Web}ToolCribDD`);
      const newData = await response.json();
      setdata(newData);
    };
    fetchData();
  }, []);
  // console.log(data);
  const [toolList, setToollist] = useState([]);
  useEffect(() => {
    fetch(`${BASE_API_URL_Web}ToolIssueList`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setToollist(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const [employeevalue, setemployeevalue] = useState(null);
  const [departmentvalue, setdepartmentvalue] = useState(null);
  const [contractorvalue, setcontractorvalue] = useState(null);
  const [tooltype, setTooltype] = useState(null);
  const [status, setstatus] = useState(null);

  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  const handleSave = async () => {
    const formData = {
      employee: employeevalue ? employeevalue.value : 0,
      contractor: contractorvalue ? contractorvalue.value : 0,
      statusID: status ? status.value : 0,
      department: departmentvalue ? departmentvalue.value : 0,
      ToolTypeID: tooltype ? tooltype.value : 0,
    };
    try {
      const response = await fetch(`${BASE_API_URL_Web}SearchIssueList`, {
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
  };
  return (
    <div>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool Issue List
      </Typography>

      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs={12} sm={0.1} md={0.1} lg={0.1} xl={0.1} mt={1}></Grid>

        <Grid item xs={12} sm={2} md={2} lg={2.5} xl={2} mt={1}>
          {data && data.toolTypeList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.toolTypeList.map((item) => ({
                label: item.ttName,
                value: item.ttid,
              }))}
              value={tooltype}
              onChange={(event, newValue) => {
                setTooltype(newValue);
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
        <Grid item xs={12} sm={2} md={2} lg={2} xl={2} mt={1}>
          {data && data.userList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.userList.map((item) => ({
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

        <Grid item xs={12} sm={1.8} md={1.8} lg={1.8} xl={1.8} mt={1}>
          {data && data.deptList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.deptList.map((item) => ({
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
          {data && data.contractorList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.contractorList.map((item) => ({
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
          {data && data.statusList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.statusList
                .filter((item) => idsToShow.includes(item.statusID)) // Filter based on specific IDs
                .map((item) => ({
                  label: item.statusName,
                  value: item.statusID,
                }))}
              value={status}
              onChange={(event, newValue) => {
                setstatus(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => <TextField {...params} label="Status" />}
              size="small"
            />
          ) : (
            <Skeleton variant="rounded" height={38} />
          )}
        </Grid>

        <Grid item xs={12} md={1} lg={1} xl={1}>
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
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "69vh", width: "100%" }}
            style={{ width: "100%" }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size="small"
              style={{ tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" width={20}>
                    S.No
                  </StyledTableCell>
                  <StyledTableCell align="left" width={75}>
                    Token/P.Slip
                  </StyledTableCell>
                  <StyledTableCell align="left" width={100}>
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left" width={85}>
                    Department
                  </StyledTableCell>
                  <StyledTableCell align="left" width={130}>
                    Tool Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={140}>
                    Tool ID & Name
                  </StyledTableCell>
                  <StyledTableCell align="left" width={50}>
                    Issue Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={50}>
                    Issue Date
                  </StyledTableCell>
                  <StyledTableCell align="left" width={65}>
                    Returnable Date
                  </StyledTableCell>
                  <StyledTableCell align="left" width={60}>
                    Issued By
                  </StyledTableCell>
                  <StyledTableCell align="left">Approved By</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FilterData.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{list.tokenNo}</TableCell>
                    <TableCell align="left">{list.conEmpDept}</TableCell>
                    <TableCell align="left">{list.departmentName}</TableCell>
                    <TableCell align="left">{list.toolType}</TableCell>
                    <TableCell align="left">{list.toolName}</TableCell>
                    <TableCell align="left">{list.issueType}</TableCell>
                    <TableCell align="left">{list.issuedDate}</TableCell>
                    <TableCell align="left">{list.returnableDate}</TableCell>
                    <TableCell align="left">{list.issuedBy}</TableCell>
                    <TableCell align="left">{list.approvedBy}</TableCell>
                    <TableCell align="left">{list.status}</TableCell>
                    <TableCell align="center">
                      {(list.status === "Tool Requested" &&
                        list.approvedBy === userName) ||
                      (list.status === "Tool Requested" &&
                        list.conEmpDept === userName) ||
                      (list.status === "Tool Requested" &&
                        list.issueType === "Returnable" &&
                        roleID === "16") ||
                      (list.status === "Tool Request Approved" &&
                        roleID === "16") ||
                      (list.status === "Issued - Permanent" &&
                        roleID === "16") ||
                      (list.status === "Issued - Temporary" &&
                        roleID === "16") ||
                      (list.status === "Under Review" && roleID === "16") ? (
                        <EditNoteIcon
                          onClick={() => handleEditClick(list.issueID)}
                          style={{ cursor: "pointer" }}
                        />
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
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "69vh", width: "100%" }}
            style={{ width: "100%" }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size="small"
              style={{ tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" width={20}>
                    S.No
                  </StyledTableCell>
                  <StyledTableCell align="left" width={75}>
                    Token/P.Slip
                  </StyledTableCell>
                  <StyledTableCell align="left" width={100}>
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left" width={85}>
                    Department
                  </StyledTableCell>
                  <StyledTableCell align="left" width={130}>
                    Tool Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={140}>
                    Tool ID & Name
                  </StyledTableCell>
                  <StyledTableCell align="left" width={50}>
                    Issue Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={50}>
                    Issue Date
                  </StyledTableCell>
                  <StyledTableCell align="left" width={65}>
                    Returnable Date
                  </StyledTableCell>
                  <StyledTableCell align="left" width={60}>
                    Issued By
                  </StyledTableCell>
                  <StyledTableCell align="left">Approved By</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolList.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left" width={30}>
                      {list.tokenNo}
                    </TableCell>
                    <TableCell align="left">{list.conEmpDept}</TableCell>
                    <TableCell align="left">{list.departmentName}</TableCell>
                    <TableCell align="left">{list.toolType}</TableCell>
                    <TableCell align="left">{list.toolName}</TableCell>
                    <TableCell align="left">{list.issueType}</TableCell>
                    <TableCell align="left">{list.issuedDate}</TableCell>
                    <TableCell align="left">{list.returnableDate}</TableCell>
                    <TableCell align="left">{list.issuedBy}</TableCell>
                    <TableCell align="left">{list.approvedBy}</TableCell>
                    <TableCell align="left">{list.status}</TableCell>
                    <TableCell align="center">
                      {(list.status === "Tool Requested" &&
                        list.approvedBy === userName) ||
                      (list.status === "Tool Requested" &&
                        list.conEmpDept === userName) ||
                      (list.status === "Tool Requested" &&
                        list.issueType === "Returnable" &&
                        roleID === "16") ||
                      (list.status === "Tool Request Approved" &&
                        roleID === "16") ||
                      (list.status === "Issued - Permanent" &&
                        roleID === "16") ||
                      (list.status === "Issued - Temporary" &&
                        roleID === "16") ||
                      (list.status === "Under Review" && roleID === "16") ? (
                        <EditNoteIcon
                          onClick={() => handleEditClick(list.issueID)}
                          style={{ cursor: "pointer" }}
                        />
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

export default IssueList;
