import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  FormControl,
  Autocomplete,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  styled,
  tableCellClasses,
  Skeleton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useApi, { BASE_API_URL_Web } from "../API/api";
import { useNavigate } from "react-router-dom";

function ToolAuditForm() {
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
  const navigate = useNavigate();

  //Get API For DropDowns
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  //#endregion

  const [toolList, settoolList] = useState([
    {
      auditID: "",
      toolID: "",
      toolName: "",
      toolCondition: 0,
      remarks: "",
    },
  ]);

  const [conEmpName, setconEmpName] = useState("");
  const [auditedBy, setauditedBy] = useState("");
  const [approvedby, setapprovedby] = useState("");
  const [auditDate, setauditDate] = useState("");
  const [auditID, setauditID] = useState("");
  const [ced, setced] = useState("");
  const [statusID, setstatusID] = useState([1, 2]);
  const statusValue = parseInt(statusID);
  const [unchangedauditBy, setunchangedauditBy] = useState("");
  const [unchangedapprovedby, setunchangedapprovedby] = useState("");

  //#region audit date
  let formattedDate = "";
  if (auditDate) {
    const now = new Date(auditDate);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  }
  //#endregion

  const handleconditionChange = (event, index) => {
    const updatedToolList = [...toolList];
    updatedToolList[index].toolCondition = event.target.value;
    settoolList(updatedToolList);
  };

  const handleRemarkschange = (e, index) => {
    const { name, value } = e.target;
    const updatedRemarks = [...toolList];
    updatedRemarks[index][name] = value;
    settoolList(updatedRemarks);
  };

  const { id } = useParams();

  useEffect(() => {
    fetch(`${BASE_API_URL_Web}GetAuditTools/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setconEmpName(resp.conEmpName);
        setauditedBy(resp.auditBy);
        setapprovedby(resp.approvedBy || "");
        localStorage.setItem("approvedby", resp.approvedBy || "");
        //#region  auditDate
        if (resp.auditDate) {
          const match = resp.auditDate.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
          if (match) {
            const [, day, month, year] = match;
            const formattedDate = `${year}-${month}-${day}`;
            setauditDate(formattedDate);
          } else {
            console.error("Invalid date format in resp.auditDate");

            setauditDate("");
          }
        } else {
          setauditDate("");
        }
        //#endregion
        setced(resp.ced);
        setauditID(resp.auditID);
        settoolList(resp.toolList);
        setstatusID(resp.statusID);
        setunchangedauditBy(resp.auditBy);
        setunchangedapprovedby(resp.approvedBy || "");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);
  const approvedbyvalue = localStorage.getItem("approvedby");

  //#region submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //#region formvalidation
    if (!formattedDate) {
      alert("Select audit Date.");
      return;
    }
    if (!auditedBy) {
      alert("Select audited By.");
      return;
    }
    if (!approvedby) {
      alert("Select approved By.");
      return;
    }
    //#endregion
    const auditBy =
      auditedBy.userID !== undefined ? auditedBy.userID : unchangedauditBy;
    const approveby =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprovedby;
    const formdata = {
      conEmpName: conEmpName,
      conEmpID: id,
      ced: ced,
      createdBy: userID,
      auditdate: formattedDate,
      auditBy: auditBy,
      approvedBy: approveby,
      approverName: "",
      toolList: toolList,
      statusID: 1,
    };
    console.log("data", formdata);
    try {
      console.log("form data", formdata);
      const response = await fetch(`${BASE_API_URL_Web}AuditInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      navigate("/ToolAuditList");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  //#endregion
  const onapproveclick = async (e) => {
    e.preventDefault();
    //#region formvalidation
    if (!formattedDate) {
      alert("Select audit Date.");
      return;
    }
    if (!auditedBy) {
      alert("Select audited By.");
      return;
    }
    //#endregion
    const auditBy =
      auditedBy.userID !== undefined ? auditedBy.userID : unchangedauditBy;
    const approveby =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprovedby;
    const formdata = {
      conEmpName: conEmpName,
      conEmpID: id,
      ced: ced,
      createdBy: userID,
      auditdate: formattedDate,
      auditBy: auditBy,
      approvedBy: approveby,
      approverName: "",
      toolList: toolList,
      statusID: 2,
    };

    try {
      console.log("form data", formdata);
      const response = await fetch(`${BASE_API_URL_Web}AuditInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      alert("Tool Audited successfully!");
      navigate("/ToolAuditList");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Tool Audit Form&nbsp;&nbsp;&nbsp;Audit ID:{auditID}
      </Typography>

      <Container>
        <Grid container spacing={2} style={{ textAlign: "center" }} mt={1}>
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <FormControl fullWidth>
              <TextField
                disabled
                value={conEmpName}
                label="Contractor/Employee"
                variant="outlined"
                size="small"
                onChange={(event) => setconEmpName(event.target.value)}
              />
            </FormControl>
          </Grid>

          <Grid item sm={3} xs={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Audit Date"
                variant="outlined"
                type="date"
                size="small"
                value={auditDate}
                onChange={(event) => setauditDate(event.target.value)}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3} lg={3} xl={3}>
            {DD.userList && DD.userList.length > 0 ? (
              <Autocomplete
                size="small"
                disablePortal
                clearIcon={null}
                options={DD.userList}
                value={
                  DD.userList.find((option) => option.userID === auditedBy) ||
                  ""
                }
                onChange={(_event, newValue) => setauditedBy(newValue)}
                getOptionLabel={(option) =>
                  option.userName || auditedBy.userName || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value || ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Audited By"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>{option.userName || ""}</li>
                )}
              />
            ) : (
              <Skeleton variant="rounded" height={38} />
            )}
          </Grid>

          <Grid item xs={12} md={3} lg={3} xl={3}>
            {DD.userList && DD.userList.length > 0 ? (
              <Autocomplete
                size="small"
                disablePortal
                clearIcon={null}
                options={DD.userList.filter(
                  (item) =>
                    item.userID !== parseInt(userID, 10) &&
                    (item.roleID === 11 || item.roleID === 5)
                )}
                value={
                  DD.userList.find((option) => option.userID === approvedby) ||
                  ""
                }
                onChange={(_event, newValue) => setapprovedby(newValue)}
                getOptionLabel={(option) =>
                  option.userName || approvedby.userName || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value || ""
                }
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
            ) : (
              <Skeleton variant="rounded" height={38} />
            )}
          </Grid>
          <Grid margin={1}></Grid>
          <TableContainer component={Paper} sx={{ maxHeight: "700px" }}>
            <Table aria-label="simple table" stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.NO</StyledTableCell>
                  <StyledTableCell align="left">Tools Issued</StyledTableCell>
                  <StyledTableCell align="left" width={20}>
                    Good
                  </StyledTableCell>
                  <StyledTableCell align="left" width={20}>
                    Lost
                  </StyledTableCell>
                  <StyledTableCell align="left" width={105}>
                    To be repaired
                  </StyledTableCell>
                  <StyledTableCell align="left">Remarks</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolList.map((list, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    hover
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      <TextField
                        fullWidth
                        disabled
                        value={list.toolName}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <FormControl>
                          <RadioGroup
                            row
                            name={`Condition-${index}`}
                            value={list.toolCondition}
                            onChange={(event) =>
                              handleconditionChange(event, index)
                            }
                          >
                            <FormControlLabel value="1" control={<Radio />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </TableCell>
                    <TableCell align="left">
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <FormControl>
                          <RadioGroup
                            row
                            name={`Condition-${index}`}
                            value={list.toolCondition}
                            onChange={(event) =>
                              handleconditionChange(event, index)
                            }
                          >
                            <FormControlLabel value="2" control={<Radio />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <FormControl>
                          <RadioGroup
                            row
                            name={`Condition-${index}`}
                            value={list.toolCondition}
                            onChange={(event) =>
                              handleconditionChange(event, index)
                            }
                          >
                            <FormControlLabel value="3" control={<Radio />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <TextField
                          fullWidth
                          key={index}
                          size="small"
                          name="remarks"
                          value={list.remarks}
                          onChange={(e) => handleRemarkschange(e, index)}
                        />
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            {statusValue === 0 ||
            (approvedbyvalue !== userID && statusValue !== 2) ? (
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            ) : null}
            &nbsp;&nbsp;
            {approvedbyvalue === userID && statusValue === 1 ? (
              <Button variant="contained" onClick={onapproveclick}>
                Approve
              </Button>
            ) : null}
          </Grid>

          <Grid item xs={12} md={4.5} lg={4.5} xl={4.5}></Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default ToolAuditForm;
