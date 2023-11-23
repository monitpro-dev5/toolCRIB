import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import AddToolPage from './Pages/AddToolPage';
import ToolListPage from './Pages/ToolListPage';
import ToolRequestPage from './Pages/ToolRequestPage';
import DemoPage from './Pages/DemoPage';
import UpdateToolPage from './Pages/UpdateToolPage';
import ToolSchedulerPage from './Pages/ToolSchedulerPage';
import InpectionListPage from './Pages/InspectionListPage';
import InspectionHistoryPage from './Pages/InspectionHistoryPage';
import UpdateRequestFormPage from './Pages/UpdateRequestFormPage';
import ToolIssueListPage from './Pages/ToolIssueListPage';
import GatePassPage from './Pages/GatePassPage';
import GatePassListPage from './Pages/GatePassListPage';
import GatePassUpdatePage from './Pages/GatePassUpdatePage';
import ToolAuditFormPage from './Pages/ToolAuditFormPage';
import ToolAuditListPage from './Pages/ToolAuditListPage'
import ToolIssueHistoryPage from './Pages/ToolIssueHistoryPage';
import UserCreatePage from './Pages/UserCreatePage';
import UserUpdatePage from './Pages/UserUpdatePage';
import UserListPage from './Pages/UserListPage';
import MyDocument from './Components/PDF/PDF';


//import { BASE_API_URL_DD_Web } from "./components/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/addtool" element={<AddToolPage />} />
        <Route path="/updatetool/:id" element={<UpdateToolPage />} />
        <Route path="/toollist" element={<ToolListPage />} />
        <Route path="/scheduler" element={<ToolSchedulerPage />} />
        <Route path="/inspectionlist" element={<InpectionListPage />} />
        <Route path="/gatepass/:id" element={<GatePassPage />} />
        <Route path="/gatepassupdate/:id" element={<GatePassUpdatePage />} />
        <Route path="/gatepasslist" element={<GatePassListPage />} />
        <Route path="/inspectionhistory" element={<InspectionHistoryPage />} />
        
        <Route path="/demo" element={<DemoPage />} />

        <Route path="/toolrequest" element={<ToolRequestPage />} />
        <Route path="/updaterequestform/:id" element={<UpdateRequestFormPage />} />
        <Route path="/issuelist" element={<ToolIssueListPage />} />
        <Route path="/toolissuehistory" element={<ToolIssueHistoryPage />} />
        <Route path="/toolauditlist" element={<ToolAuditListPage/>}/>
        <Route path="/toolauditform/:id" element={<ToolAuditFormPage/>}/>

        <Route path="/usercreate" element={<UserCreatePage/>}/>
        <Route path="/userupdate/:id" element={<UserUpdatePage/>}/>
        <Route path="/userlist" element={<UserListPage/>}/>

        <Route path="/pdf/:id" element={<MyDocument />} />

        {/* Redirect from the root URL to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;