import React from 'react'
import MenuTabs from '../Components/MenuTabs'
import UpdateRequestForm from '../Components/UpdateRequestForm'

export default function AddToolPage() {
  return (
    <>
    <div className="menu-tabs-container">
        <MenuTabs />
    </div>
    <br/><br/><br/><br/>
    <UpdateRequestForm />
    </>
  )
}
