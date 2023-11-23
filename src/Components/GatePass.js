import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useApi, { BASE_API_URL_Web } from "../API/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  Container,
  Autocomplete,
  Alert,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import Loading from "./Loading";

function GatePass() {
  //#region Loading
  const [isLoading, setIsLoading] = useState(false);
  const [waitLoading, setWaitLoading] = useState(false);
  //#endregion
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const { id } = useParams();

  const { data: DD } = useApi(`${BASE_API_URL_Web}ToolCribDD`);

  //#region Field values
  const [ToolID, setToolID] = useState("");
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedToolTagName, setSelectedToolTagName] = useState("");

  const [selectedToolTypeDD, setSelectedToolTypeDD] = useState(null);
  const [ToolNameID, setToolNameID] = useState([]);

  const [selectedToolTagNameDD, setSelectedToolTagNameDD] = useState(null);
  const [GatePassNo, setGatePassNo] = useState(0);
  const [Description, setDescription] = useState("");
  const [Purpose, setPurpose] = useState("");
  const [VendorName, setVendorName] = useState(null);
  const [VendorAddress, setVendorAddress] = useState("");
  const [VendorContactNo, setVendorContactNo] = useState("");
  useEffect(() => {
    if (VendorName) {
      setVendorAddress(VendorName.address);
      setVendorContactNo(VendorName.contactNo);
    } else {
      setVendorAddress("");
      setVendorContactNo("");
    }
  }, [VendorName]);

  const [Value, setValue] = useState("");
  const [ExDOM, setExDOM] = useState("");
  const [ApprovedBy, setApprovedBy] = useState(null);
  const [Transport, setTransport] = useState("");
  const [GateOut, setGateOut] = useState("");
  const [GateIn, setGateIn] = useState("");
  const [Remarks, setRemarks] = useState("");

  //#endregion

  useEffect(() => {
    if (id > 0) {
      fetch(`${BASE_API_URL_Web}GetGatePass/` + id)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          setSelectedToolType(resp.toolTypeID);
          setSelectedToolTagName(resp.toolTagName);
          setToolID(resp.toolID);
          console.log(resp);
          setWaitLoading(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id === "0" && selectedToolTypeDD !== null) {
      console.log("sadsad", selectedToolTypeDD);
      fetch(`${BASE_API_URL_Web}GetToolList/` + selectedToolTypeDD.value)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          setToolNameID(resp);
          console.log(resp);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [id, selectedToolTypeDD]);

  const handleSubmit = async () => {
    //#region Required Fields
    if (!Description) {
      alert("Enter Material Description.");
      return;
    }

    if (!Purpose) {
      alert("Enter Purpose.");
      return;
    }

    if (!VendorName) {
      alert("Select VendorName.");
      return;
    }

    if (!Value) {
      alert("Enter Approximate Value.");
      return;
    }

    if (!ExDOM) {
      alert("Give Expected Return Date.");
      return;
    }

    if (!ApprovedBy) {
      alert("Select Approver");
      return;
    }

    if (!Transport) {
      alert("Enter Mode of Transport & Vehicle Reg No.");
      return;
    }
    //#endregion

    //#region Date Format

    //Expected Date Of Return
    const ExDOMdate = new Date(ExDOM);
    const ExDOMday = ExDOMdate.getDate().toString().padStart(2, "0");
    const ExDOMmonth = (ExDOMdate.getMonth() + 1).toString().padStart(2, "0");
    const ExDOMyear = ExDOMdate.getFullYear();
    const ExDOMFormatted = `${ExDOMday}/${ExDOMmonth}/${ExDOMyear}`;

    //Gate Out Date
    const GateOutdate = new Date(GateOut);
    const GateOutday = GateOutdate.getDate().toString().padStart(2, "0");
    const GateOutmonth = (GateOutdate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const GateOutyear = GateOutdate.getFullYear();
    const GateOuthours = GateOutdate.getHours().toString().padStart(2, "0");
    const GateOutminutes = GateOutdate.getMinutes().toString().padStart(2, "0");
    const GateOutFormatted = `${GateOutday}/${GateOutmonth}/${GateOutyear} ${GateOuthours}:${GateOutminutes}`;

    //Approved Date
    const GateIndate = new Date(GateIn);
    const GateInday = GateIndate.getDate().toString().padStart(2, "0");
    const GateInmonth = (GateIndate.getMonth() + 1).toString().padStart(2, "0");
    const GateInyear = GateIndate.getFullYear();
    const GateInhours = GateIndate.getHours().toString().padStart(2, "0");
    const GateInminutes = GateIndate.getMinutes().toString().padStart(2, "0");
    const GateInFormatted = `${GateInday}/${GateInmonth}/${GateInyear} ${GateInhours}:${GateInminutes}`;

    //#endregion

    //#region FormData
    const formData = new FormData();
    formData.append("SCID", parseInt(id, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID ? ToolID : selectedToolTagNameDD.value);
    formData.append(
      "ToolTypeID",
      selectedToolType ? selectedToolType : selectedToolTypeDD.value
    );
    formData.append(
      "ToolTagName",
      selectedToolTagName ? selectedToolTagName : selectedToolTagNameDD.label
    );
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append("VendorID", VendorName.vendorID);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append("ApprovedBy", ApprovedBy ? ApprovedBy.value : 0);
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append("GateOutDate", GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : "");
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 12);
    formData.append("FormFile", null);
    formData.append("Attachment", null);

    //#endregion

    setIsLoading(true);
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      const res = await axios.post(
        `${BASE_API_URL_Web}GatePassInsert`,
        formData
      );

      console.log("Data received from API:", res);
      console.log("ID", res.data.id);
      alert("Gate Pass " + res.data.id + " Created Successfully");
      setIsLoading(false);

      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
        navigate("/gatepasslist");
      }, 2000);
    } catch (error) {
      alert("Dynamic Load Content Failed");
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;Create External Gate Pass &nbsp;&nbsp;&nbsp;&nbsp; SCID : {id}
      </Typography>

      {isLoading ? (
        <Loading />
      ) : (
        <Container>
          <Grid container spacing={2} style={{ textAlign: "center" }} mt={1}>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {id > 0 ? (
                <>
                  {DD.toolTypeList && DD.toolTypeList.length > 0 && waitLoading ? (
                    <Autocomplete
                      disablePortal
                      required
                      id="tooltypeid"
                      size="small"
                      options={DD.toolTypeList}
                      value={
                        DD.toolTypeList.find(
                          (option) => option.ttid === selectedToolType
                        ) || ""
                      }
                      getOptionLabel={(option) =>
                        option.ttName || selectedToolType.ttName || ""
                      }
                      onChange={(event, newValue) => {
                        setSelectedToolType(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tool Type"
                          variant="outlined"
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>{option.ttName}</li>
                      )}
                      disabled
                    />
                  ) : (
                    <Skeleton variant="rounded" height={38} />
                  )}
                </>
              ) : (
                <>
                  {DD && DD.toolTypeList ? (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={DD.toolTypeList.map((item) => ({
                        label: item.ttName,
                        value: item.ttid,
                      }))}
                      value={selectedToolTypeDD}
                      onChange={(event, newValue) => {
                        setSelectedToolTypeDD(newValue);
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
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {id > 0 && waitLoading ? (
                <>
                  <TextField
                    fullWidth
                    label="Tool Tag Name"
                    variant="outlined"
                    size="small"
                    value={selectedToolTagName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </>
              ) : (
                <>
                  {ToolNameID ? (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={ToolNameID.map((item) => ({
                        label: item.tagname,
                        value: item.toolID,
                      }))}
                      value={selectedToolTagNameDD}
                      onChange={(event, newValue) => {
                        setSelectedToolTagNameDD(newValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Tool Tag Name" />
                      )}
                      size="small"
                    />
                  ) : (
                    <Skeleton variant="rounded" height={38} />
                  )}
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Gate Pass No"
                variant="outlined"
                size="small"
                disabled
                value={GatePassNo}
                onChange={(event, newValue) => {
                  setGatePassNo(newValue);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} mt={1}>
              <TextField
                fullWidth
                id="outlined-textarea"
                label="Description of the material"
                placeholder="With S.No, Capacity Model, Make, Size, etc,."
                multiline
                size="small"
                value={Description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Purpose"
                variant="outlined"
                size="small"
                value={Purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              {DD.vendorList ? (
                <Autocomplete
                  disablePortal
                  required
                  id="approvedby"
                  size="small"
                  options={DD.vendorList.filter(
                    (option) => option && option.vendorName
                  )}
                  value={VendorName}
                  onChange={(event, newValue) => {
                    setVendorName(newValue);
                  }}
                  getOptionLabel={(option) =>
                    option && option.vendorName ? option.vendorName : ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor Name"
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>{option.vendorName}</li>
                  )}
                />
              ) : (
                <Skeleton variant="rounded" height={38} />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Vendor Address"
                variant="outlined"
                size="small"
                value={VendorAddress}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Vendor Contact No"
                variant="outlined"
                size="small"
                value={VendorContactNo}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>

            <br />
            <br />

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Approximate Value (Rs)"
                variant="outlined"
                size="small"
                value={Value}
                onChange={(event) => {
                  const numericValue = event.target.value.replace(
                    /[^0-9]/g,
                    ""
                  ); // Replace non-numeric characters with an empty string
                  const limitedValue = numericValue.slice(0, 9);
                  setValue(limitedValue);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Expected Date Of Return"
                type="date"
                variant="outlined"
                size="small"
                value={ExDOM}
                onChange={(event) => setExDOM(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
            {DD && DD.userList ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DD.userList
                      .filter((item) => item.userID !== parseInt(userID, 10) &&
                      (item.roleID === 11 || item.roleID === 5))
                      .map((item) => ({
                        label: item.userName,
                        value: item.userID,
                      }))}
                    value={ApprovedBy}
                    onChange={(event, newValue) => {
                      setApprovedBy(newValue);
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

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Mode Of Transport & Reg No"
                variant="outlined"
                size="small"
                value={Transport}
                onChange={(event) => setTransport(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Gate Out Date Time"
                type="datetime-local"
                variant="outlined"
                size="small"
                value={GateOut}
                onChange={(event) => setGateOut(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Gate In Date Time"
                type="datetime-local"
                variant="outlined"
                size="small"
                value={GateIn}
                onChange={(event) => setGateIn(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={1}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                size="small"
                value={Remarks}
                onChange={(event) => setRemarks(event.target.value)}
              />
            </Grid>

            <br />
            <br />

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Button
                variant="extended"
                size="medium"
                color="secondary"
                style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
              
            </Grid>

            <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

            <Grid item xs={12} md={8} lg={8} xl={8} mt={1}>
              {isSaved && (
                <Alert severity="success">Updated Successfully</Alert>
              )}
            </Grid>

            <Grid item xs={2} md={2} lg={2} xl={2}></Grid>

            <br />
          </Grid>
        </Container>
      )}
    </>
  );
}

export default GatePass;
