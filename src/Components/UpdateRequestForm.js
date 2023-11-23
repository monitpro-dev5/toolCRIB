import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Autocomplete,
  Button,
  Typography,
  Skeleton,
  styled,
  tableCellClasses,
} from "@mui/material";
import useApi, { BASE_API_URL_Web } from "../API/api";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function UpdateRequestForm() {
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
  const roleID = localStorage.getItem("roleID");

  const navigate = useNavigate();

  const [currentDateTime, setCurrentDateTime] = useState("");
  const [purpose, setPursose] = useState("");
  const [type, setType] = useState("");
  const [Permanent, setPermanent] = useState(false);
  const [returnable, setreturnable] = useState(false);
  const [requestedBy, setRequestedBy] = useState("");
  const [employeeDD, setEmployeeDD] = useState(false);
  const [contractorDD, setContractorDD] = useState(false);
  const [employeevalue, setemployeevalue] = useState("");
  const [toolName, setToolName] = useState(null);
  const [departmentvalue, setdepartmentvalue] = useState("");
  const [contractorvalue, setcontractorvalue] = useState("");
  const [approvedby, setapprovedby] = useState("");
  const [approvedComments, setApprovedComments] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [status, setstatus] = useState([3, 4, 5, 2]);

  //#region unchanged
  const [unchangedemployee, setunchangedemployee] = useState("");
  const [unchangeddepartment, setunchangeddepartment] = useState("");
  const [unchangedcontractor, setunchangedcontractor] = useState("");
  const [unchangedapprover, setunchangedapprover] = useState("");
  //#endregion

  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
      const year = now.getFullYear();
      return `${day}/${month}/${year}`;
    };
    setIssuedDate(getCurrentDateTime());
  }, []);

  //#region disablefunctions

  const handlePermanentClick = () => {
    setreturnable(true);
    setPermanent(false);
    setDateofreturn("");
  };

  const handlereturnclick = () => {
    setreturnable(false);
    setPermanent(true);
    setapprovedby("");
  };

  const handleoffdutyclick = () => {
    setreturnable(true);
    setPermanent(true);
    setDateofreturn("");
    setapprovedby("");
  };

  const handleemployeeClick = () => {
    setEmployeeDD(false);
    setContractorDD(true);
    setcontractorvalue(0);
    setunchangedcontractor(0);
  };
  const handleClickDD = () => {
    setEmployeeDD(true);
    setContractorDD(false);
    setemployeevalue(0);
    setunchangedemployee(0);
    setdepartmentvalue("");
    setunchangeddepartment(0);
  };

  //#endregion

  const calculateTotalQuantity = () => {
    return itemLists.reduce((total, item) => total + item.quantity, 0);
  };

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

  //#region addrow
  const [itemLists, setitemLists] = useState([
    {
      ttid: null,
      tagName: "",
      tokenNo: "",
      quantity: "",
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

  const handletooltypeChange = (event, index, newValue) => {
    const updatedTooltype = [...itemLists];
    updatedTooltype[index].ttid = newValue?.ttid || null;
    updatedTooltype[index].quantity = "";
    setitemLists(updatedTooltype);
    setToolName(updatedTooltype[index].ttid);
    console.log(updatedTooltype); // Use updatedToolList for logging
  };

  const handletagnameChange = (event, newValue, index) => {
    const updatedTag = [...itemLists];
    updatedTag[index].tagName = newValue?.tagname;
    setitemLists(updatedTag);
    console.log(updatedTag);
  };

  const handlequantitychange = (e, index) => {
    const { value } = e.target;
    const updatedquantity = [...itemLists];
    if (/^[0-9]*$/.test(value)) {
      const newQuantity = parseInt(value, 10);
      updatedquantity[index].quantity = Math.min(
        newQuantity,
        updatedquantity[index].availableToolData || 99
      );
      setitemLists(updatedquantity);
    }
  };
  //#endregion

  //#region tooltype and toolID/Name api
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

          setTooltagID(data);
        } catch (error) {
          //  Handle errors here
          console.error("API Error:", error);
        }
      };
      // Call the fetchData function
      fetchData();
    }
  }, [toolName]);
  //#endregion

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

  const statusValue = parseInt(status);
  //#region approvebutton
  const [isApproveButtonEnabled, setIsApproveButtonEnabled] = useState(false);

  useEffect(() => {
    if (approvedby.toString() === userID) {
      setIsApproveButtonEnabled(true);
    } else {
      setIsApproveButtonEnabled(false);
    }
  }, [approvedby, userID]);
  //#endregion

  //#region api gettoolissuevalues

  const { id } = useParams();
  useEffect(() => {
    const storedDepartmentID = localStorage.getItem("departmentID");
    if (storedDepartmentID) {
      // Find the corresponding departmentName in your data
      const department = DD.userList?.find(
        (item) => item.departmentID === parseInt(storedDepartmentID, 10)
      );
      if (department) {
        setdepartmentvalue(department.departmentName);
      }
    }
  }, [DD]);
  useEffect(() => {
    fetch(`${BASE_API_URL_Web}GetToolIssue/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setCurrentDateTime(resp.requestedDate);
        setPursose(resp.purpose);
        setType(resp.issueType);
        setRequestedBy(resp.requestedBy);
        setDateofreturn(resp.returnableDate);
        if (resp.returnableDate) {
          const match = resp.returnableDate.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
          if (match) {
            const [, day, month, year] = match;
            const formattedDate = `${year}-${month}-${day}`;
            setDateofreturn(formattedDate);
          } else {
            console.error("Invalid date format in resp.returnableDate");

            setDateofreturn("");
          }
        } else {
          setDateofreturn("");
        }
        //#endregion
        setemployeevalue(resp.issuedToEmployee || 0);
        localStorage.setItem("departmentID", resp.departmentID || 0);
        setcontractorvalue(resp.issuedToContractor || 0);
        setapprovedby(resp.approvedBy || 0);
        setApprovedComments(resp.approverComments);
        setIssuedDate(resp.issuedDate);
        setitemLists(resp.itemLists);
        setstatus(resp.status);

        setunchangedemployee(resp.issuedToEmployee || 0);
        setunchangeddepartment(resp.departmentID || 0);
        setunchangedcontractor(resp.issuedToContractor || 0);
        setunchangedapprover(resp.approvedBy || 0);
      })

      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);
  //#endregion

  //#region submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID =
      employeevalue.userID !== undefined
        ? employeevalue.userID
        : unchangedemployee;
    const departmentID =
      employeevalue.departmentID !== undefined
        ? employeevalue.departmentID
        : unchangeddepartment;
    const contractID =
      contractorvalue.contractID !== undefined
        ? contractorvalue.contractID
        : unchangedcontractor;
    const approved =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprover;
    const formdata = {
      issueID: id,
      requestedDate: currentDateTime,
      issueType: type,
      issuedToContractor: contractID,
      issuedToEmployee: userID,
      returnableDate: formattedDate || "",
      requestedBy: requestedBy,
      approvedBy: approved,
      purpose: purpose,
      departmentID: departmentID,
      itemLists: itemLists,
      status: 3,
    };

    try {
      const response = await fetch(`${BASE_API_URL_Web}Issueupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle the response here
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      alert("Updated successfully!");
      navigate("/issuelist");
    } catch (error) {
      // Handle errors here
      console.error("API Error:", error);
    }
  };
  //#endregion

  //#region approve

  const handleApproveClick = async (e) => {
    e.preventDefault();
    const userID =
      employeevalue.userID !== undefined
        ? employeevalue.userID
        : unchangedemployee;
    const departmentID =
      employeevalue.departmentID !== undefined
        ? employeevalue.departmentID
        : unchangeddepartment;
    const contractID =
      contractorvalue.contractID !== undefined
        ? contractorvalue.contractID
        : unchangedcontractor;
    const approved =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprover;

    if (!approvedComments) {
      alert("Give approver Comments");
      return;
    }
    const formdata = {
      issueID: id,
      requestedDate: currentDateTime,
      issueType: type,
      issuedToContractor: contractID || 0,
      issuedToEmployee: userID || 0,
      returnableDate: formattedDate || "",
      requestedBy: requestedBy,
      approvedBy: approved || 0,
      approverComments: approvedComments,
      purpose: purpose,
      departmentID: departmentID || 0,
      itemLists: itemLists,
      status: 10,
    };
    try {
      const response = await fetch(`${BASE_API_URL_Web}Issueupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle the response here
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      alert("Approved successfully!");
      navigate("/issuelist");

      // You can perform further actions or state updates based on the response
    } catch (error) {
      // Handle errors here
      console.error("API Error:", error);
    }
  };
  //#endregion

  //#region issue
  const handleissueClick = async (e) => {
    e.preventDefault();
    const empuserID =
      employeevalue.userID !== undefined
        ? employeevalue.userID
        : unchangedemployee;
    const departmentID =
      departmentvalue.departmentID !== undefined
        ? departmentvalue.departmentID
        : unchangeddepartment;
    const contractID =
      contractorvalue.contractID !== undefined
        ? contractorvalue.contractID
        : unchangedcontractor;
    const approved =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprover;

    const status =
      type === "Returnable" || type === "Offduty"
        ? 5
        : type === "Permanent"
        ? 4
        : 3;

    const formdata = {
      issueID: id,
      requestedDate: currentDateTime,
      issueType: type,
      issuedToContractor: contractID,
      issuedToEmployee: empuserID,
      issuedBy: userID,
      returnableDate: formattedDate || "",
      requestedBy: requestedBy,
      approvedBy: approved,
      approverComments: approvedComments,
      purpose: purpose,
      departmentID: departmentID,
      itemLists: itemLists,
      status: status,
    };
    try {
      const response = await fetch(`${BASE_API_URL_Web}Issueupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle the response here
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      alert("Issued successfully!");
      navigate("/issuelist");

      // You can perform further actions or state updates based on the response
    } catch (error) {
      // Handle errors here
      console.error("API Error:", error);
    }
  };
  //#endregion

  //#region return

  const handleRetrunClick = async (e) => {
    e.preventDefault();
    const userID =
      employeevalue.userID !== undefined
        ? employeevalue.userID
        : unchangedemployee;
    const departmentID =
      employeevalue.departmentID !== undefined
        ? employeevalue.departmentID
        : unchangeddepartment;
    const contractID =
      contractorvalue.contractID !== undefined
        ? contractorvalue.contractID
        : unchangedcontractor;
    const approved =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprover;

    const formdata = {
      issueID: id,
      requestedDate: currentDateTime,
      issueType: type,
      issuedToContractor: contractID,
      issuedToEmployee: userID,
      returnableDate: formattedDate || "",
      requestedBy: requestedBy,
      approvedBy: approved,
      approverComments: approvedComments,
      purpose: purpose,
      departmentID: departmentID,
      itemLists: itemLists,
      status: 2,
    };
    try {
      const response = await fetch(`${BASE_API_URL_Web}Issueupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle the response here
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      alert("Returned successfully!");
      navigate("/issuelist");
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  //#endregion

  const handleunderreviewclick = async (e) => {
    e.preventDefault();
    const userID =
      employeevalue.userID !== undefined
        ? employeevalue.userID
        : unchangedemployee;
    const departmentID =
      employeevalue.departmentID !== undefined
        ? employeevalue.departmentID
        : unchangeddepartment;
    const contractID =
      contractorvalue.contractID !== undefined
        ? contractorvalue.contractID
        : unchangedcontractor;
    const approved =
      approvedby.userID !== undefined ? approvedby.userID : unchangedapprover;
    const formdata = {
      issueID: id,
      requestedDate: currentDateTime,
      issueType: type,
      issuedToContractor: contractID,
      issuedToEmployee: userID,
      returnableDate: formattedDate || "",
      requestedBy: requestedBy,
      approvedBy: approved,
      approverComments: approvedComments,
      purpose: purpose,
      departmentID: departmentID,
      itemLists: itemLists,
      status: 11,
    };
    try {
      const response = await fetch(`${BASE_API_URL_Web}Issueupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle the response here
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      // alert("Returned successfully!");
      navigate("/issuelist");
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  //#endregion

  return (
    <div>
      <Typography variant="h5" component="div">
        &nbsp;&nbsp;&nbsp;Update Tool Request &nbsp;&nbsp;&nbsp;&nbsp;Issued ID:
        {id}
      </Typography>

      <Container>
        <form onSubmit={handleSubmit} id="updateform">
          <Grid container spacing={1} style={{ textAlign: "center" }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <TextField
                  disabled
                  label="Date of Request"
                  variant="outlined"
                  value={currentDateTime}
                  onChange={setCurrentDateTime}
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
                  onChange={(event) => setType(event.target.value)}
                  name="radio"
                >
                  <FormControlLabel
                    value="Returnable"
                    control={<Radio />}
                    label="Returnable"
                    onClick={handlereturnclick}
                  />
                  <FormControlLabel
                    value="Permanent"
                    control={<Radio />}
                    label="Permanent"
                    onClick={handlePermanentClick}
                  />
                  <FormControlLabel
                    value="Offduty"
                    control={<Radio />}
                    label="Off-duty"
                    onClick={handleoffdutyclick}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl fullWidth>
                <TextField
                  disabled={!Permanent}
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
                <FormLabel
                  id="Request"
                  className="d-flex"
                  style={{ textAlign: "left" }}
                >
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
                    onClick={handleemployeeClick}
                  />
                  <FormControlLabel
                    value="Contractor"
                    control={<Radio />}
                    label="Contractor"
                    onClick={handleClickDD}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {DD.userList && DD.userList.length > 0 ? (
                <Autocomplete
                  size="small"
                  disabled={!contractorDD}
                  clearIcon={null}
                  options={DD.userList.filter(
                    (item) =>
                      item.departmentID !== null &&
                      item.roleID !== 5 &&
                      item.roleID !== 11
                  )}
                  value={
                    DD.userList.find(
                      (option) => option.userID === employeevalue
                    ) || ""
                  }
                  onChange={(event, newValue) => {
                    setemployeevalue(newValue);
                    setdepartmentvalue(newValue ? newValue.departmentName : "");
                  }}
                  getOptionLabel={(option) =>
                    option.userName || employeevalue.userName || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value || ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee ID/Name"
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
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl fullWidth>
                <TextField
                  disabled
                  label="Department"
                  variant="outlined"
                  value={departmentvalue}
                  size="small"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              {DD.contractorList && DD.contractorList.length > 0 ? (
                <Autocomplete
                  size="small"
                  disablePortal
                  clearIcon={null}
                  disabled={!employeeDD}
                  options={DD.contractorList}
                  value={
                    DD.contractorList.find(
                      (option) => option.contractID === contractorvalue
                    ) || ""
                  }
                  onChange={(event, newValue) => setcontractorvalue(newValue)}
                  getOptionLabel={(option) =>
                    option.companyName || contractorvalue.companyName || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value || ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Contractor"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.companyName}</li>
                  )}
                />
              ) : (
                <Skeleton variant="rounded" height={38} />
              )}
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              {DD.userList && DD.userList.length > 0 ? (
                <Autocomplete
                  size="small"
                  disablePortal
                  clearIcon={null}
                  disabled={!returnable}
                  options={DD.userList.filter(
                    (item) =>
                      item.userID !== parseInt(userID, 10) &&
                      (item.roleID === 11 || item.roleID === 5)
                  )}
                  value={
                    DD.userList.find(
                      (option) => option.userID === approvedby
                    ) || ""
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
            <Grid item xs={12} md={8} lg={8} xl={8}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  disabled={!isApproveButtonEnabled}
                  label="Approver comments"
                  variant="outlined"
                  value={approvedComments}
                  onChange={(event) => setApprovedComments(event.target.value)}
                  size="small"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} lg={4} xl={4} mt={2}></Grid>
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
                              clearIcon={null}
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
                                handletooltypeChange(e, index, newValue)
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
                              clearIcon={null}
                              size="small"
                              disablePortal
                              onChange={(event, newValue) =>
                                handletagnameChange(event, newValue, index)
                              }
                              options={tooltagID}
                              value={
                                tooltagID.find(
                                  (option) => option.tagname === item.tagName
                                ) || ""
                              }
                              name="tooltagID"
                              getOptionLabel={(option) =>
                                option.tagname || item.tagName || ""
                              }
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
                                size="small"
                                type="number"
                                value={item.quantity}
                                name="quantity"
                                inputProps={{
                                  min: 0,
                                  max: item.availableToolData || 99,
                                }}
                                disabled
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
            <Grid item xs={12} md={8.2} lg={8.6} xl={8.2}></Grid>
            <Grid item xs={12} md={1.9} lg={1.3} xl={1.9}>
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
              </Button>
              &nbsp;&nbsp;
              {statusValue === 3 &&
              !isApproveButtonEnabled &&
              roleID !== "16" ? (
                <Button
                  style={{
                    backgroundColor: "#2C7EDA",
                    color: "#fff",
                  }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              ) : null}
              {statusValue === 3 && isApproveButtonEnabled ? (
                <Button
                  style={{
                    backgroundColor: "#2C7EDA",
                    color: "#fff",
                  }}
                  variant="contained"
                  onClick={handleApproveClick}
                >
                  APPROVE
                </Button>
              ) : null}
              {roleID === "16" &&
              ((statusValue === 3 && type === "Returnable") ||
                statusValue === 10) ? (
                <Button
                  style={{
                    backgroundColor: "#2C7EDA",
                    color: "#fff",
                  }}
                  variant="contained"
                  onClick={handleissueClick}
                >
                  ISSUE
                </Button>
              ) : null}
              {(statusValue === 4 || statusValue === 5) && roleID === "16" ? (
                <Button
                  onClick={handleunderreviewclick}
                  style={{
                    backgroundColor: "#2C7EDA",
                    color: "#fff",
                  }}
                  variant="contained"
                >
                  Under Review
                </Button>
              ) : null}{" "}
              &nbsp;&nbsp;
              {(statusValue === 4 || statusValue === 5 || statusValue === 11) &&
              roleID === "16" ? (
                <Button
                  onClick={handleRetrunClick}
                  style={{
                    backgroundColor: "#2C7EDA",
                    color: "#fff",
                  }}
                  variant="contained"
                >
                  Return
                </Button>
              ) : null}
            </Grid>{" "}
            {issuedDate ? <br /> : <br />}
          </Grid>
        </form>
      </Container>
      <br />
      <br />
    </div>
  );
}

export default UpdateRequestForm;
