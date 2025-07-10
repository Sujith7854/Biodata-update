import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Home</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <button
          onClick={() => navigate("/admin-dashboard/applications")}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-700"
        >
          Manage Applications
        </button>

        <button
          onClick={() => navigate("/admin-dashboard/access-requests")}
          className="bg-green-600 text-white px-6 py-4 rounded-lg shadow hover:bg-green-700"
        >
          Manage Access Requests
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminHome;
