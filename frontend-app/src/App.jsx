import React from "react";
import { Routes, Route } from "react-router-dom";
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

      {/* Admin routes - optional to protect differently */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminHome />} />
      <Route path="/admin-dashboard/applications" element={<AdminApplications />} />
      <Route path="/admin-dashboard/access-requests" element={<AdminAccessRequests />} />
    </Routes>
    </IdleRedirectWrapper>
  );
}

export default App;
