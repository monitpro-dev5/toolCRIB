import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Autocomplete,
  Typography,
  Skeleton,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi, { BASE_API_URL_Web } from "../API/api";

function RequestForm() {
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

  const navigate = useNavigate();

  const userID = localStorage.getItem("userID");

  const [purpose, setPursose] = useState("");
  const [type, SetType] = useState("");
  const [Permanent, setPermanent] = useState("");
  const [state, setState] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [employeeDD, setEmployeeDD] = useState("");
  const [contractorDD, setContractorDD] = useState("");
  const [employeevalue, setemployeevalue] = useState(null);
  const [departmentvalue, setdepartmentvalue] = useState("");
  const [contractorvalue, setcontractorvalue] = useState(null);
  const [approvedby, setapprovedby] = useState(null);
  const [approvedComments, setApprovedComments] = useState("");
  const [toolName, setToolName] = useState(null);

  //#region Currentdatetime
  const [currentDateTime, setCurrentDateTime] = useState("");
  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    setCurrentDateTime(getCurrentDateTime());
  }, []);
  //#endregion

  //#region disablefunctions
  React.state = {
    disabled: true,
  };

  const handleClick = (event) => {
    if (event.target.value === "Returnable") {
      setState({
        disabled: false,
      });
    } else {
      setState({
        disabled: true,
      });
      setDateofreturn("");
    }
  };

  const handleonclick = (event) => {
    setState(event.target.value);
    setState({
      disabled: false,
    });
  };

  const handlepermanentclick = (event) => {
    if (event.target.value === "Permanent") {
      setPermanent({
        disabled: false,
      });
    } else {
      setPermanent({
        disabled: true,
      });
      setapprovedby("");
    }
  };
  const handlepermanentchange = (event) => {
    setPermanent(event.target.value);
    setPermanent({
      disabled: false,
    });
  };
  const handleddClick = (event) => {
    if (event.target.value === "Employee,Department") {
      setEmployeeDD({
        disabled: false,
      });
    } else {
      setEmployeeDD({
        disabled: true,
      });
      setcontractorvalue("");
    }
  };

  const handleddonChange = (e) => {
    setEmployeeDD(e.target.value);
    setEmployeeDD({
      disabled: false,
    });
  };

  const handleClickDD = (event) => {
    if (event.target.value === "contractor") {
      setContractorDD({
        disabled: false,
      });
    } else {
      setContractorDD({
        disabled: true,
      });
      setemployeevalue("");
      setdepartmentvalue("");
    }
  };

  const handleonchange = (e) => {
    setContractorDD(e.target.value);
    setContractorDD({
      disabled: false,
    });
  };
  //#endregion

  //#region Date Of Return
  const [dateofreturn, setDateofreturn] = useState("");

  let formattedDate = "";
  if (dateofreturn) {
    const now = new Date(dateofreturn);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const year = now.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  }
  //#endregion

  //Get API For DropDowns
  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);
  //#endregion

  //#region addrow and its onchange function
  const [itemLists, setitemLists] = useState([
    {
      ttid: null,
      tagName: "",
      tokenNo: "",
      quantity: "",
      availableToolData: "",
    },
  ]);

  const handleaddrow = () => {
    setitemLists([
      ...itemLists,
      {
        ttid: null,
        tagName: "",
        tokenNo: "",
        quantity: "",
        availableToolData: "",
      },
    ]);
  };

  const onDelete = (index) => {
    const updatedDelete = [...itemLists];
    updatedDelete.splice(index, 1);
    setitemLists(updatedDelete);
  };

  const handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const updatedToken = [...itemLists];
    updatedToken[index][name] = value;
    setitemLists(updatedToken);
  };

  const handleDropdownChange = (event, index, newValue) => {
    setitemLists((prevItemLists) => {
      const updatedTooltype = [...prevItemLists];
      updatedTooltype[index].ttid = newValue?.ttid || null;
      updatedTooltype[index].quantity = "";
      setToolName(updatedTooltype[index].ttid);
      return updatedTooltype;
    });
  };

  const handletagnameChange = (event, newValue, index) => {
    const updatedTag = [...itemLists];
    updatedTag[index].tagName = newValue?.tagname;
    setitemLists(updatedTag);
  };

  const handlequantitychange = (e, index) => {
    const { value } = e.target;
    const updatedquantity = [...itemLists];
    if (/^[0-9]*$/.test(value)) {
      const newQuantity = parseInt(value, 10);
      updatedquantity[index].quantity = Math.min(
        newQuantity,
        updatedquantity[index].availableToolData || 99 || ""
      );
      setitemLists(updatedquantity);
    }
  };

  const calculateTotalQuantity = () => {
    return itemLists.reduce(
      (total, item) => (item.quantity ? total + item.quantity : total),
      0
    );
  };

  //#endregion
  useEffect(() => {
    if (employeevalue) {
      setdepartmentvalue(employeevalue.departmentName);
    }
  }, [employeevalue]);

  const handleEmployeeSelection = (event, newValue) => {
    setemployeevalue(newValue);
  };

  //#region tooltype api
  const [tooltype, setTooltype] = useState([]);

  useEffect(() => {
    fetch(`${BASE_API_URL_Web}ToolCribDD`)
      .then((response) => response.json())
      .then((json) => setTooltype(json.toolTypeList));
  }, []);

  const [tooltagID, setTooltagID] = useState([]);
  useEffect(() => {
    if (toolName) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL_Web}GetTagList/${toolName}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json(); // Parse the JSON response
          setTooltagID(data); // Update the state with the API data
        } catch (error) {
          //  Handle errors here
          console.error("API Error:", error);
        }
      };
      fetchData();
    }
  }, [toolName]);
  //#endregion

  //#region api for available quantity

  useEffect(() => {
    const fetchedTtids = new Set();
    const controller = new AbortController();
    const fetchDataForItem = async (item, index) => {
      if (
        !item.ttid ||
        fetchedTtids.has(item.ttid) ||
        controller.signal.aborted
      ) {
        return;
      }
      try {
        const response = await fetch(
          `${BASE_API_URL_Web}AvailableTools?ToolTypeID=${item.ttid}&TagName=${item.tagName}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setitemLists((prevItemLists) => {
          if (prevItemLists[index]) {
            const updatedItem = {
              ...prevItemLists[index],
              availableToolData: data,
            };
            return [
              ...prevItemLists.slice(0, index),
              updatedItem,
              ...prevItemLists.slice(index + 1),
            ];
          }
          return prevItemLists;
        });

        fetchedTtids.add(item.ttid);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("API Error for ttid", item.ttid, ":", error);
        }
      }
    };
    itemLists.forEach((item, index) => {
      fetchDataForItem(item, index);
    });
    return () => {
      // Clean up the AbortController when the component unmounts or when itemLists changes.
      controller.abort();
    };
  }, [itemLists]);

  //#endregion

  //#region submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // #region formvalidation
    if (!type) {
      alert("Select Issue Type.");
      return;
    }

    if (type.toLowerCase() === "returnable") {
      if (!dateofreturn) {
        alert("Select Returnable Date.");
        return;
      }
    }
    if (type.toLowerCase() === "permanent") {
      if (!approvedby) {
        alert("Select Approved By.");
        return;
      }
    }
    if (!requestedBy) {
      alert("Select Requested By.");
      return;
    }
    if (requestedBy.toLowerCase() === "employee") {
      if (!employeevalue || !departmentvalue) {
        alert("Select Employee ID/Name and Department .");
        return;
      }
    }
    if (requestedBy.toLowerCase() === "contractor") {
      if (!contractorvalue) {
        alert("Select Contractor.");
        return;
      }
    }

    if (
      itemLists.some(
        (item) =>
          item.ttid === null ||
          item.tagName === "" ||
          item.tokenNo === "" ||
          item.quantity === ""
      )
    ) {
      alert(
        "Select Tooltype, ToolID/Name, Token/Pinslip Number, and Quantity."
      );
      return;
    }
    //#endregion

    const formdata = {
      issueType: type,
      issuedToContractor: contractorvalue ? contractorvalue.value : 0,
      issuedToEmployee: employeevalue ? employeevalue.value : 0,
      returnableDate: formattedDate,
      requestedBy: requestedBy,
      approvedBy: approvedby ? approvedby.value : 0,
      approverComments: approvedComments,
      purpose: purpose,
      departmentID: employeevalue.departmentID,
      itemLists: itemLists,
      status: 3,
    };
    try {
      console.log("form data", formdata);
      const response = await fetch(`${BASE_API_URL_Web}IssueInsert`, {
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
      alert("Tool Requested successfully!");
      navigate("/issuelist");
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  //#endregion

  return (
    <div>
      <Typography variant="h5" component="div">
        &nbsp;&nbsp;&nbsp;Tool Request
      </Typography>

      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1} style={{ textAlign: "center" }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <TextField
                  disabled
                  label="Date of Request"
                  variant="outlined"
                  value={currentDateTime}
                  name="dateofrequest"
                  margin="normal"
                  size="small"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <TextField
                  label="Purpose"
                  variant="outlined"
                  value={purpose}
                  onChange={(event) => setPursose(event.target.value)}
                  margin="normal"
                  size="small"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl>
                <FormLabel id="Type" style={{ textAlign: "left" }}>
                  Issue Type
                </FormLabel>
                <RadioGroup
                  row
                  value={type}
                  onChange={(event) => SetType(event.target.value)}
                  name="radio"
                >
                  <FormControlLabel
                    value="Returnable"
                    control={<Radio />}
                    label="Returnable"
                    onClick={handleonclick}
                    onChange={handlepermanentclick}
                  />
                  <FormControlLabel
                    value="Permanent"
                    control={<Radio />}
                    label="Permanent"
                    onClick={handleClick}
                    onChange={handlepermanentchange}
                  />
                  <FormControlLabel
                    value="Offduty"
                    control={<Radio />}
                    label="Off-duty"
                    onClick={handleonclick}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl fullWidth>
                <TextField
                  disabled={state.disabled}
                  InputLabelProps={{ shrink: true }}
                  label="Date of Return"
                  variant="outlined"
                  value={dateofreturn}
                  onChange={(event) => setDateofreturn(event.target.value)}
                  type="date"
                  margin="normal"
                  size="small"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl>
                <FormLabel id="Request" style={{ textAlign: "left" }}>
                  Requested by
                </FormLabel>
                <RadioGroup
                  row
                  name="RequestedBy"
                  value={requestedBy}
                  onChange={(event) => setRequestedBy(event.target.value)}
                >
                  <FormControlLabel
                    value="Employee"
                    control={<Radio />}
                    label="Employee"
                    onClick={handleddClick}
                    onChange={handleonchange}
                  />
                  <FormControlLabel
                    value="Contractor"
                    control={<Radio />}
                    label="Contractor"
                    onClick={handleClickDD}
                    onChange={handleddonChange}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {DD && DD.userList ? (
                <Autocomplete
                  disablePortal
                  disabled={contractorDD.disabled}
                  id="combo-box-demo"
                  options={DD.userList
                    .filter(
                      (item) =>
                        item.departmentID !== null &&
                        item.roleID !== 5 &&
                        item.roleID !== 11
                    )

                    .map((item) => ({
                      label: item.userName,
                      value: item.userID,
                      departmentID: item.departmentID,
                      departmentName: item.departmentName,
                    }))}
                  value={employeevalue}
                  onChange={handleEmployeeSelection}
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

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                fullWidth
                disabled
                label="Department"
                variant="outlined"
                value={departmentvalue}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
              {DD && DD.contractorList ? (
                <Autocomplete
                  disablePortal
                  disabled={employeeDD.disabled}
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

            <Grid item xs={12} md={4} lg={4} xl={4}>
              {DD && DD.userList ? (
                <Autocomplete
                  disablePortal
                  disabled={Permanent.disabled}
                  options={DD.userList
                    .filter(
                      (item) =>
                        item.userID !== parseInt(userID, 10) &&
                        (item.roleID === 11 || item.roleID === 5)
                    )
                    .map((item) => ({
                      label: item.userName,
                      value: item.userID,
                    }))}
                  value={approvedby}
                  onChange={(event, newValue) => {
                    setapprovedby(newValue);
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

            <Grid item xs={12} md={8} lg={8} xl={8}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  disabled
                  label="Approver comments"
                  variant="outlined"
                  value={approvedComments}
                  onChange={(event) => setApprovedComments(event.target.value)}
                  size="small"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4} mt={2}></Grid>

            <TableContainer component={Paper} sx={{ maxHeight: "289px" }}>
              <Table aria-label="simple table" stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">S.NO</StyledTableCell>
                    <StyledTableCell width={320} align="left">
                      Tool Type
                    </StyledTableCell>
                    <StyledTableCell width={200} align="left">
                      Tool ID & Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Token/Pink Slip No
                    </StyledTableCell>
                    <StyledTableCell align="left">Quantity</StyledTableCell>
                    <StyledTableCell width={100} align="left">
                      Available
                    </StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemLists.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      hover
                    >
                      <TableCell align="center">{index + 1}</TableCell>

                      <TableCell align="left">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {tooltype ? (
                            <Autocomplete
                              fullWidth
                              disablePortal
                              getOptionLabel={(option) => option.ttName || ""}
                              options={tooltype}
                              size="small"
                              value={
                                tooltype.find(
                                  (option) => option.ttid === item.ttid
                                ) || null
                              }
                              name="tooltype"
                              onChange={(e, newValue) =>
                                handleDropdownChange(e, index, newValue)
                              }
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              renderOption={(props, option) => (
                                <li {...props} key={option.ttid}>
                                  {option.ttName}
                                </li>
                              )}
                            />
                          ) : (
                            <Skeleton variant="rounded" height={38} />
                          )}
                        </Grid>
                      </TableCell>

                      <TableCell align="left">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {tooltagID ? (
                            <Autocomplete
                              fullWidth
                              size="small"
                              disablePortal
                              onChange={(event, newValue) =>
                                handletagnameChange(event, newValue, index)
                              }
                              options={tooltagID}
                              value={tooltagID.find(
                                (option) => option.tagname === item.tagName
                              )}
                              name="tooltagID"
                              getOptionLabel={(option) => option.tagname}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              renderOption={(props, option) => (
                                <li {...props}>{option.tagname}</li>
                              )}
                            />
                          ) : (
                            <Skeleton variant="rounded" height={38} />
                          )}
                        </Grid>
                      </TableCell>

                      <TableCell align="left">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          <TextField
                            fullWidth
                            value={item.tokenNo}
                            name="tokenNo"
                            onChange={(e) => handleinputchange(e, index)}
                            size="small"
                          />
                        </Grid>
                      </TableCell>

                      <TableCell align="left">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {item.availableToolData !== null &&
                          item.availableToolData !== undefined ? (
                            item.availableToolData === 0 ? (
                              <TextField
                                fullWidth
                                disabled
                                size="small"
                                type="number"
                                value={item.quantity}
                                name="quantity"
                                inputProps={{
                                  min: 0,
                                  max: item.availableToolData || 99,
                                }}
                              />
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={item.quantity}
                                name="quantity"
                                onChange={(e) => handlequantitychange(e, index)}
                                inputProps={{
                                  min: 0,
                                  max: item.availableToolData || 99,
                                }}
                              />
                            )
                          ) : (
                            <Skeleton variant="rounded" height={38} />
                          )}
                        </Grid>
                      </TableCell>
                      <TableCell align="left">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {item.availableToolData !== null &&
                          item.availableToolData !== undefined ? (
                            item.availableToolData === 0 ? (
                              <div>Not available</div>
                            ) : (
                              <TextField
                                fullWidth
                                disabled
                                key={index}
                                value={itemLists[index].availableToolData}
                                size="small"
                              />
                            )
                          ) : (
                            <Skeleton variant="rounded" height={38} />
                          )}
                        </Grid>
                      </TableCell>

                      <TableCell align="center">
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {index === 0 ? (
                            ""
                          ) : (
                            <IconButton
                              color="primary"
                              onClick={() => onDelete(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid item xs={12} md={8.6} lg={8.6} xl={8.6}></Grid>

            <Grid item xs={12} md={1.3} lg={1.3} xl={1.3}>
              <FormControl>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="Total Quantity"
                  variant="outlined"
                  size="small"
                  value={calculateTotalQuantity()}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#2C7EDA",
                  color: "#fff",
                }}
                onClick={handleaddrow}
              >
                ADD ROW
              </Button>{" "}
              &nbsp;&nbsp;
              <Button
                style={{
                  backgroundColor: "#2C7EDA",
                  color: "#fff",
                }}
                variant="contained"
                type="Submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <br />
      <br />
    </div>
  );
}

export default RequestForm;
