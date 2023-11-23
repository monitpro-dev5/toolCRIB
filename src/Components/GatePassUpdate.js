import React, { useState, useEffect, useRef } from "react";
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadedConfirmed from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import Loading from "./Loading";

function GatePassUpdate() {
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
  const [SCID, setSCID] = useState("");
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedToolTypeID, setSelectedToolTypeID] = useState("");
  const [selectedToolTagName, setSelectedToolTagName] = useState("");
  const [GatePassNo, setGatePassNo] = useState(0);
  const [Description, setDescription] = useState("");
  const [Purpose, setPurpose] = useState("");
  const [VendorName, setVendorName] = useState(null);
  const [VendorNameID, setVendorNameID] = useState("");
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
  const [ApprovedByID, setApprovedByID] = useState("");
  const [Transport, setTransport] = useState("");
  const [GateOut, setGateOut] = useState("");
  const [GateIn, setGateIn] = useState("");
  const [Remarks, setRemarks] = useState("");

  const [Status, setStatus] = useState("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [UploadedIcon, setUploadedIcon] = useState(false);
  //#endregion

  useEffect(() => {
    if (id > 0) {
      fetch(`${BASE_API_URL_Web}GetGatePassGPID/` + id)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          console.log(resp);
          setSCID(resp.scid);
          setSelectedToolType(resp.toolTypeID);
          setSelectedToolTypeID(resp.toolTypeID);

          setSelectedToolTagName(resp.toolTagName);
          setToolID(resp.toolID);
          setGatePassNo(resp.gpid);
          setVendorName(resp.vendorID);
          setVendorNameID(resp.vendorID);
          setVendorAddress(resp.vendorAddress);
          setVendorContactNo(resp.vendorContactNo);
          setValue(resp.approximateValue);
          setApprovedBy(resp.approvedBy);
          setApprovedByID(resp.approvedBy);
          if (resp.remarks !== "null") {
            setRemarks(resp.remarks);
          } else {
            setRemarks("");
          }
          setTransport(resp.modeoftransport);
          setPurpose(resp.purpose);
          setDescription(resp.materialDesc);
          setStatus(resp.statusID);
          //#region Date format change into datetime picker
          if (resp.returnDate) {
            const parsedExDOM = resp.returnDate.split("/").reverse().join("-");
            setExDOM(parsedExDOM);
          }

          if (resp.gateOutDate !== "") {
            const [datePart, timePart] = resp.gateOutDate.split(" "); // Split date and time parts
            const [day, month, year] = datePart.split("/"); // Split day, month, and year
            const [hours, minutes] = timePart.split(":"); // Split hours and minutes
            const parsedGateOutDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            setGateOut(parsedGateOutDate);
          }

          if (resp.gateInDate !== "") {
            const [datePart, timePart] = resp.gateInDate.split(" "); // Split date and time parts
            const [day, month, year] = datePart.split("/"); // Split day, month, and year
            const [hours, minutes] = timePart.split(":"); // Split hours and minutes
            const parsedGateInDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            setGateIn(parsedGateInDate);
          }
          setWaitLoading(true);
          //#endregion
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [id]);

  //#region Attachment
  const fileInputRef = useRef(null);

  const handleAttachment = () => {
    // Trigger a click event on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    console.log("SSSS", e.target.files[0]);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUploadedIcon(true);
  };
  //#endregion

  const handleSave = async () => {
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

    //Get IN Date
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append(
      "GateOutDate",
      GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : ""
    );
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 12);
    formData.append("FormFile", file ? file : null);
    formData.append("Attachment", fileName ? fileName : null);

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
      alert("Gate Pass " + res.data.id + " Saved Successfully");
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

  const handleSubmit = async () => {
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

    //Get IN Date
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append(
      "GateOutDate",
      GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : ""
    );
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 13);
    formData.append("FormFile", file ? file : null);
    formData.append("Attachment", fileName ? fileName : null);

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
      alert("Gate Pass " + res.data.id + " Submitted Successfully");
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

  const handleApprove = async () => {
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

    //Get IN Date
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append(
      "GateOutDate",
      GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : ""
    );
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 14);
    formData.append("FormFile", file ? file : null);
    formData.append("Attachment", fileName ? fileName : null);

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
      alert("Gate Pass " + res.data.id + " Approved Successfully");
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

  const handleDispatch = async () => {
    //#region Required Fields
    if (!GateOut) {
      alert("Give Gate Out Date");
      return;
    }

    if (!Transport) {
      alert("Enter Mode of Transport");
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

    //Get IN Date
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append(
      "GateOutDate",
      GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : ""
    );
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 15);
    formData.append("FormFile", file ? file : null);
    formData.append("Attachment", fileName ? fileName : null);

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
      alert("Gate Pass " + res.data.id + " Material Dispatched Successfully");
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

  const handleReceived = async () => {
    //#region Required Fields
    if (!GateIn) {
      alert("Give Gate In Date");
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

    //Get IN Date
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append(
      "GateOutDate",
      GateOutFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateOutFormatted : ""
    );
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 16);
    formData.append("FormFile", file ? file : null);
    formData.append("Attachment", fileName ? fileName : null);

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
      alert("Gate Pass " + res.data.id + " Material Received Successfully");
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

  const handleClose = async () => {
    //#region Required Fields

    if (!file) {
      alert("Insert Files");
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
    formData.append("SCID", parseInt(SCID, 10));
    formData.append("GPID", GatePassNo);
    formData.append("ToolID", ToolID);
    formData.append(
      "ToolTypeID",
      selectedToolType === undefined ? selectedToolTypeID : selectedToolType
    );
    formData.append("ToolTagName", selectedToolTagName);
    formData.append("MaterialDesc", Description);
    formData.append("Purpose", Purpose);
    formData.append(
      "VendorID",
      VendorNameID !== "" ? VendorNameID : VendorName.vendorID
    );
    formData.append("VendorAddress", VendorAddress);
    formData.append("VendorContactNo", VendorContactNo);
    formData.append("ApproximateValue", parseInt(Value, 10));
    formData.append("ReturnDate", ExDOMFormatted);
    formData.append("CreatedBy", parseInt(userID, 10));
    formData.append(
      "ApprovedBy",
      ApprovedByID !== "" ? ApprovedByID : ApprovedBy.userID
    );
    formData.append("ApprovedDate", "");
    formData.append("Modeoftransport", Transport);
    formData.append("GateOutDate", GateOutFormatted);
    formData.append(
      "GateInDate",
      GateInFormatted !== "NaN/NaN/NaN NaN:NaN" ? GateInFormatted : ""
    );
    formData.append("Remarks", Remarks ? Remarks : null);
    formData.append("StatusID", 17);
    formData.append("FormFile", file);
    formData.append("Attachment", fileName);

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
      alert("Gate Pass " + res.data.id + " Closed Successfully");
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

  const deleteAttachment = () => {
    setFile();
    setFileName("");
    setUploadedIcon(false);
  };

  return (
    <>
      <Typography variant="h5" component="div" mt={1}>
        &nbsp;&nbsp;&nbsp;External Gate Pass &nbsp;&nbsp;&nbsp;&nbsp; GPID :{" "}
        {GatePassNo} &nbsp;&nbsp;&nbsp;&nbsp; SCID : {SCID}
      </Typography>

      {isLoading ? (
        <Loading />
      ) : (
        <Container>
          <Grid container spacing={2} style={{ textAlign: "center" }} mt={1}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {id > 0 ? (
                <>
                  {DD.toolTypeList &&
                  DD.toolTypeList.length > 0 &&
                  waitLoading ? (
                    <Autocomplete
                      disablePortal
                      required
                      clearIcon={null}
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
                  <Skeleton variant="rounded" animation="wave" height={38} />
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
                <Skeleton variant="rounded" animation="wave" height={38} />
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
              {DD.vendorList && DD.vendorList.length > 0 && waitLoading ? (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  size="small"
                  options={DD.vendorList}
                  value={
                    DD.vendorList.find(
                      (option) => option.vendorID === VendorName
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.vendorName || VendorName.vendorName || ""
                  }
                  onChange={(event, newValue) => {
                    setVendorName(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
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
              {DD.userList && DD.userList.length > 0 && waitLoading ? (
                <Autocomplete
                  disablePortal
                  required
                  clearIcon={null}
                  id="approvedby"
                  size="small"
                  options={DD.userList.filter(
                    (item) =>
                      item.userID !== parseInt(userID, 10) &&
                      (item.roleID === 11 || item.roleID === 5)
                  )}
                  value={
                    DD.userList.find(
                      (option) => option.userID === ApprovedBy
                    ) || ""
                  }
                  getOptionLabel={(option) =>
                    option.userName || ApprovedBy.userName || ""
                  }
                  onChange={(event, newValue) => {
                    setApprovedBy(newValue);
                  }}
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
                disabled={Status === 14 ? false : true}
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
                disabled={Status === 15 ? false : true}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} mt={2}>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                title="Insert Files"
                onClick={handleAttachment}
                disabled={Status === 16 ? false : true}
              >
                <AttachFileIcon />
                {UploadedIcon ? (
                  <>
                    <UploadedConfirmed sx={{ color: "#10EF13" }} />
                    {fileName !== "" ? <p>{fileName}</p> : <></>}
                  </>
                ) : (
                  <>
                    <UploadedConfirmed sx={{ color: "white" }} />
                    <DeleteIcon sx={{ color: "white" }} />
                  </>
                )}
              </button>
              <input
                type="file"
                accept="*/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
              {UploadedIcon && Status === 16 ? (
                <DeleteIcon
                  onClick={deleteAttachment}
                  sx={{ color: "red" }}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={10} lg={10} xl={10} mt={1}>
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
              {Status === 12 && ApprovedByID !== parseInt(userID, 10) && (
                <>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </>
              )}
              {Status === 13 && (
                <>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                </>
              )}
              {Status === 14 && (
                <>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleDispatch}
                  >
                    Material Dispatched
                  </Button>
                </>
              )}
              {Status === 15 && (
                <>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleReceived}
                  >
                    Material Received
                  </Button>
                </>
              )}
              {Status === 16 && (
                <>
                  <Button
                    variant="extended"
                    size="medium"
                    color="secondary"
                    style={{ backgroundColor: "#2C7EDA", color: "#fff" }}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </>
              )}
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

export default GatePassUpdate;
