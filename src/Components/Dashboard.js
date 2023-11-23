import React from "react";

export default function DashBoard() {
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const userID = localStorage.getItem("userID");
  const DepartmentID = localStorage.getItem("departmentID");
  const DepartmentName = localStorage.getItem("departmentName");
  const RoleID = localStorage.getItem("roleID");
  const RoleName = localStorage.getItem("roleName");
  const Image = localStorage.getItem("imageName");

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Under Progess...</h1>
      <h2>Token : {userToken}</h2>
      <h2>UserName : {userName}</h2>
      <h2>UserID : {userID}</h2>
      <h2>DepartmentID : {DepartmentID}</h2>
      <h2>DepartmentName : {DepartmentName}</h2>
      <h2>RoleID : {RoleID}</h2>
      <h2>RoleName : {RoleName}</h2>
      <h2>Image : {Image}</h2>
    </>
  );
}
