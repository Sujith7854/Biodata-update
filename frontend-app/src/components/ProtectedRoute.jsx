import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isVerified = localStorage.getItem("is_verified") === "true";
  return isVerified ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
