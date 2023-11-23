import React from 'react'
import MenuTabs from '../Components/MenuTabs'
import ToolRequestForm from '../Components/ToolRequestForm'
import "../Styles/style.css";

export default function ToolRequestPage() {
  return (
    <>
    <div className="menu-tabs-container">
        <MenuTabs />
    </div>
    <br/><br/><br/><br/>
    <ToolRequestForm />
    </>
  )
}
