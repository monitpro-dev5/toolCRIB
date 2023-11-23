import React from 'react'
import MenuTabs from '../Components/MenuTabs'
import UserUpdate from '../Components/UserUpdate'
import "../Styles/style.css";


export default function UserUpdatePage() {
  return (
    <>
    <div className="menu-tabs-container">
        <MenuTabs />
    </div>
    <br/><br/><br/><br/>
    <UserUpdate />
    </>
  )
}
