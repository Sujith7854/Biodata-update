import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BiodataForm from "./components/BiodataForm";
import AdminLogin from "./components/AdminLogin";
import AdminHome from "./components/AdminHome";
import AdminApplications from "./components/AdminApplications";
import AdminAccessRequests from "./components/AdminAccessRequests";
import BrowseApplications from "./components/BrowseApplications";
import BrowseByYear from "./components/BrowseByYear";
import RegistrationForm from "./components/RegistrationForm";
import OTPVerification from "./components/OTPVerification";
import RegisterAndOTPFlow from "./components/RegisterAndOTPFlow";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import IdleRedirectWrapper from "./components/IdleRedirectWrapper";
import UserLogin from "./components/UserLogin"; 
import UploadCSV from "./components/UploadCSV";
import ManageApplications from "./components/ManageApplications";
import EditApplication from "./components/EditApplication";
import RejectedApplications from "./components/RejectedApplications";
//import EditApplicationModule from "./components/EditApplicationModal";
//import ExistingUserAccess from "./components/ExistingUserAccess";

function App() {
  return (
    <IdleRedirectWrapper>
      <Routes>
      <Route path="/" element={<RegisterAndOTPFlow />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      {/* Protected Routes for users */}
      
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <BiodataForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <BrowseApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse/:gender"
        element={
          <ProtectedRoute>
            <BrowseApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse/:gender/:year"
        element={
          <ProtectedRoute>
            <BrowseByYear />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse/:gender/:year/:id"
        element={
          <ProtectedRoute>
            <BrowseByYear />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-login"
        element={<UserLogin />}
      />
      <Route
        path="/manage-applications"
        element={
          <ProtectedRoute>
            <ManageApplications />
          </ProtectedRoute>
        }
      />
      <Route path="/edit-application/:main_contact_number" element={<EditApplication />} />
      {/* <Route path="/edit-application-modal/:main_contact_number" element={<EditApplicationModule />} /> */}

      {/* Admin routes - optional to protect differently */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminHome />} />
      <Route path="/admin-dashboard/applications" element={<AdminApplications />} />
      <Route path="/admin-dashboard/access-requests" element={<AdminAccessRequests />} />
      <Route path="/admin-dashboard/upload-csv" element={<UploadCSV />} />
      {/* <Route path="/admin-dashboard/existing-user-access" element={<ExistingUserAccess />} /> */}
      <Route path="/admin-dashboard/rejected-applications" element={<RejectedApplications />} />


      {/* Fallback route */}
    </Routes>
    </IdleRedirectWrapper>
  );
}

export default App;