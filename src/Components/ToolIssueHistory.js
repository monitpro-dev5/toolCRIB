import React, { useState, useEffect } from "react";
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
  Skeleton,
  styled,
  tableCellClasses,
} from "@mui/material";

function ToolIssueHistory() {
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
  //Get API For DropDowns
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  //#endregion

  const [toolList, setToollist] = useState([]);
  useEffect(() => {
    fetch(`${BASE_API_URL_Web}ToolIssueHistory`)
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
  const [fromissuedate, setfromissuedate] = useState("");
  const [toissuedate, settoissuedate] = useState("");
  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  //#region formatteddate for fromissueddate and toissueddate
  let formattedDate = "";
  if (fromissuedate) {
    const now = new Date(fromissuedate);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  }
  let formattedtoDate = "";
  if (toissuedate) {
    const now = new Date(toissuedate);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedtoDate = `${day}/${month}/${year}`;
  }
  //#endregion

  const handleSave = async () => {
    const formData = {
      employee: employeevalue ? employeevalue.value : 0,
      contractor: contractorvalue ? contractorvalue.value : 0,
      department: departmentvalue ? departmentvalue.value : 0,
      toolTypeID: tooltype ? tooltype.value : 0,
      fromDate: formattedDate ? formattedDate : "",
      toDate: formattedtoDate ? formattedtoDate : "",
    };
    try {
      console.log("formData:", formData);
      const response = await fetch(`${BASE_API_URL_Web}SearchIssueHistory`, {
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
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool Issue History
      </Typography>

      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs={12} sm={0.1} md={0.1} lg={0.1} xl={0.1} mt={1}></Grid>

        <Grid item xs={12} sm={2.1} md={2.1} lg={2.1} xl={2.1} mt={1}>
          {DD && DD.toolTypeList ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={DD.toolTypeList.map((item) => ({
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

        <Grid item xs={12} sm={1.5} md={1.5} lg={1.5} xl={1.5} mt={1}>
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
        <Grid item xs={12} sm={1.6} md={1.6} lg={1.6} xl={1.6} mt={1}>
          <TextField
            label="from (issued date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={fromissuedate}
            onChange={(event) => setfromissuedate(event.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={1.6} md={1.6} lg={1.6} xl={1.6} mt={1}>
          <TextField
            label="To (issued date)"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={toissuedate}
            onChange={(event) => settoissuedate(event.target.value)}
            size="small"
            fullWidth
          />
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
            sx={{ maxHeight: "65vh", width: "100%" }}
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
                  <StyledTableCell align="left" width={80}>
                    Token/P.Slip
                  </StyledTableCell>
                  <StyledTableCell align="left" width={120}>
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left" width={90}>
                    Department
                  </StyledTableCell>
                  <StyledTableCell align="left" width={140}>
                    Tool Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={150}>
                    Tool ID & Name
                  </StyledTableCell>
                  <StyledTableCell align="left" width={60}>
                    Issue Type
                  </StyledTableCell>
                  <StyledTableCell align="left">Issue Date</StyledTableCell>
                  <StyledTableCell align="left">Returned Date</StyledTableCell>
                  <StyledTableCell align="left">Issued By</StyledTableCell>
                  <StyledTableCell align="left">Approved By</StyledTableCell>
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
                    <TableCell align="left">{list.returnedDate}</TableCell>
                    <TableCell align="left">{list.issuedBy}</TableCell>
                    <TableCell align="left">{list.approvedBy}</TableCell>
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
            sx={{ maxHeight: "65vh", width: "100%" }}
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
                  <StyledTableCell align="left" width={80}>
                    Token/P.Slip
                  </StyledTableCell>
                  <StyledTableCell align="left" width={120}>
                    Contractor /Employee
                  </StyledTableCell>
                  <StyledTableCell align="left" width={70}>
                    Department
                  </StyledTableCell>
                  <StyledTableCell align="left" width={140}>
                    Tool Type
                  </StyledTableCell>
                  <StyledTableCell align="left" width={150}>
                    Tool ID & Name
                  </StyledTableCell>
                  <StyledTableCell align="left" width={60}>
                    Issue Type
                  </StyledTableCell>
                  <StyledTableCell align="left">Issue Date</StyledTableCell>
                  <StyledTableCell align="left">Returned Date</StyledTableCell>
                  <StyledTableCell align="left">Issued By</StyledTableCell>
                  <StyledTableCell align="left">Approved By</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolList.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{list.tokenNo}</TableCell>
                    <TableCell align="left">{list.conEmpDept}</TableCell>
                    <TableCell align="left">{list.departmentName}</TableCell>
                    <TableCell align="left">{list.toolType}</TableCell>
                    <TableCell align="left">{list.toolName}</TableCell>
                    <TableCell align="left">{list.issueType}</TableCell>
                    <TableCell align="left">{list.issuedDate}</TableCell>
                    <TableCell align="left">{list.returnedDate}</TableCell>
                    <TableCell align="left">{list.issuedBy}</TableCell>
                    <TableCell align="left">{list.approvedBy}</TableCell>
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

export default ToolIssueHistory;
