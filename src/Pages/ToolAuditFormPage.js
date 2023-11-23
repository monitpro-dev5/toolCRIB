import React from 'react'
import MenuTabs from '../Components/MenuTabs'
import ToolAuditForm from '../Components/ToolAuditForm'
import "../Styles/style.css";


export default function ToolAuditFormPage() {
  return (
    <>
     <div className="menu-tabs-container">
        <MenuTabs />
    </div>
    <br/><br/><br/><br/>
    <ToolAuditForm />
    </>
  )
}





