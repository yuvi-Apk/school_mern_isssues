import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "../Pages/Admin";
import Login from "../Pages/Login";
import PublicDashboard from "../Pages/PublicDashboard";
import ConfirmBranch from "../Pages/ConfirmBranch";
import AddBranch from "../Pages/AddBranch";
import Create from "../Pages/Create.jsx";
import AdmissionForm from "./AdmissionForm.jsx";
import CreateFee from "../Pages/CreateFee.jsx";
import SectionManager from "../Pages/SectionManager";
import ClassManager from "../Pages/ClassManager";
import AttendanceCriteria from "../Pages/AttendanceCriteria";
import Configuefee from "../Pages/Configuefee.jsx";
import CreateAccount from "../Pages/CreateAccount";
import CreateFeesHeading from "../Pages/CreateFeesHeading";
import ConfigureFeesPlan from "../Pages/ConfigureFeesPlan";
import StudentSearchPage from "../Pages/StudentSearchPage";
import StudentProfile from "../Pages/StudentProfile";
import FeesReceipt from "./FeesReceipt.jsx";
import FeesRegister from "../Pages/Fees_Register.jsx";
import FeesHeadWiseCollection from "./FeesHeadWiseCollection.jsx";
import AccountList from "./AccountList.jsx";
import CreateRoutes from "../Pages/CreateRoutes.jsx";
import ConfigureRoutePlan from "../Pages/ConfigureRoutePlan.jsx";
import Dashboard from "./Dashboard.jsx";
import PaymentDetailsTable from "./PaymentDetailsTable.jsx";
import Register from "../Pages/Register.jsx";
import ForgotPassword from "./ForgetPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Fees from "../layout/Fees.jsx"
const Navigation = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route path="/fees" element={<Fees/>} />

        {/* Branch management routes */}
        <Route path="/add-branch" element={<AddBranch />} />
        <Route path="/Fees-Receipt" element={<FeesReceipt />} />
        <Route path="/confirm-branch" element={<ConfirmBranch />} />
        <Route path="/Admission" element={<AdmissionForm />} />
        <Route path="/fees_Register" element={<FeesRegister />} />
        <Route path="/create" element={<Create />} />
       
        <Route path="/ConfigueFee" element={<Configuefee />} />
        <Route
          path="/FeesHeadWiseCollection"
          element={<FeesHeadWiseCollection />}
        />
        <Route path="/Std-Attendance" element={<AttendanceCriteria />} />
       
        <Route path="/accounts" element={<AccountList/>}/>
        <Route path="/Create-Fees-Heading" element={<CreateFeesHeading />} />
        <Route path="/Create-Account" element={<CreateAccount />} />
        <Route path="/routes" element={<CreateRoutes/>} />
        <Route path="/apply-Routes" element={<ConfigureRoutePlan/>} />
        
        <Route path="/section-manager" element={<SectionManager />} />
        <Route path="/searchStudent" element={<StudentSearchPage />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/class-manager" element={<ClassManager />} />
        <Route path="/Forget-Password" element={<ForgotPassword/>} />
        <Route path="/Reset-Password" element={<ResetPassword/>} />
        <Route path="/PaymentDetailsTable" element={<PaymentDetailsTable/>} />
        <Route path="/Register" element={<Register/>} />

        <Route path="/attendance-criteria" element={<AttendanceCriteria />} />
        {/* Admin route */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard/>} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </Router>
  );
};

export default Navigation;
