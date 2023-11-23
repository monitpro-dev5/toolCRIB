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
  TextField,
  Fab,
  Container,
  Grid,
  Typography,
  IconButton,
  styled,
  tableCellClasses,
} from "@mui/material";

function UserList() {
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

  const handleEditClick = (id) => {
    navigate("/userupdate/" + id);
  };

  const [userlist, setuserlist] = useState([]);
  useEffect(() => {
    fetch(`${BASE_API_URL_Web}UserList`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setuserlist(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);
  console.log(userlist);
  const [usernamefilter, setusernamefilter] = useState("");

  const [isFilter, setisFilter] = useState(false);
  const [FilterData, setFilterData] = useState([]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_Web}SearchUser?UserName=${usernamefilter}`,
        {
          method: "Post",
        }
      );

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
        &nbsp;&nbsp;&nbsp;User List
      </Typography>

      <Container>
        <Grid container spacing={1} style={{ textAlign: "center" }}>
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
            <TextField
              label="First Name"
              variant="outlined"
              value={usernamefilter}
              onChange={(event) => setusernamefilter(event.target.value)}
              margin="normal"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={1} lg={1} xl={1} mt={1.5}>
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
      </Container>

      <br></br>
      {isFilter ? (
        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "66vh" }}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.NO</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
                  <StyledTableCell align="left">User</StyledTableCell>
                  <StyledTableCell align="left">Employee ID</StyledTableCell>
                  <StyledTableCell align="left">First Name</StyledTableCell>
                  <StyledTableCell align="left">Last Name</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Mobile No</StyledTableCell>
                  <StyledTableCell align="left">Designation</StyledTableCell>
                  <StyledTableCell align="left">Role</StyledTableCell>
                  <StyledTableCell align="left">Department</StyledTableCell>
                  <StyledTableCell align="left">Active</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {FilterData.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      {" "}
                      <IconButton
                        to={`/userupdate/${list.userID}`}
                        edge="start"
                        color="inherit"
                        aria-label="Edit"
                        id={list.userID}
                        onClick={() => handleEditClick(list.userID)}
                      >
                        <EditNoteIcon sx={{ color: "#000" }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">{list.userImage}</TableCell>
                    <TableCell align="left">{list.employeeID}</TableCell>
                    <TableCell align="left">{list.firstName}</TableCell>
                    <TableCell align="left">{list.lastName}</TableCell>
                    <TableCell align="left">{list.userName}</TableCell>
                    <TableCell align="left">{list.mobileNo}</TableCell>
                    <TableCell align="left">{list.designation}</TableCell>
                    <TableCell align="left">{list.roleName}</TableCell>
                    <TableCell align="left">{list.deptName}</TableCell>
                    {list.isActive ? (
                      <TableCell align="center">Yes</TableCell>
                    ) : (
                      <TableCell align="center">No</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "66vh" }}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.NO</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
                  <StyledTableCell align="left">User</StyledTableCell>
                  <StyledTableCell align="left">Employee ID</StyledTableCell>
                  <StyledTableCell align="left">First Name</StyledTableCell>
                  <StyledTableCell align="left">Last Name</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Mobile No</StyledTableCell>
                  <StyledTableCell align="left">Designation</StyledTableCell>
                  <StyledTableCell align="left">Role</StyledTableCell>
                  <StyledTableCell align="left">Department</StyledTableCell>
                  <StyledTableCell align="left">Active</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {userlist.map((list, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      {" "}
                      <IconButton
                        to={`/userupdate/${list.userID}`}
                        edge="start"
                        color="inherit"
                        aria-label="Edit"
                        id={list.userID}
                        onClick={() => handleEditClick(list.userID)}
                      >
                        <EditNoteIcon sx={{ color: "#000" }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">{list.userImage}</TableCell>
                    <TableCell align="left">{list.employeeID}</TableCell>
                    <TableCell align="left">{list.firstName}</TableCell>
                    <TableCell align="left">{list.lastName}</TableCell>
                    <TableCell align="left">{list.userName}</TableCell>
                    <TableCell align="left">{list.mobileNo}</TableCell>
                    <TableCell align="left">{list.designation}</TableCell>
                    <TableCell align="left">{list.roleName}</TableCell>
                    <TableCell align="left">{list.deptName}</TableCell>
                    {list.isActive ? (
                      <TableCell align="center">Yes</TableCell>
                    ) : (
                      <TableCell align="center">No</TableCell>
                    )}
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

export default UserList;
