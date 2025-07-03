import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import BiodataForm from "./components/BiodataForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import BrowseApplications from "./components/BrowseApplications"; 
import BrowseByYear from "./components/BrowseByYear";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 relative">
    {/* Top Right Admin Login */}
    <div className="absolute top-6 right-6">
      <Link to="/admin-login">
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Admin Login
        </button>
      </Link>
    </div>

    <h1 className="text-4xl font-bold text-gray-800 mb-6">
      Biodata Application System
    </h1>
    <p className="text-lg text-gray-600 mb-8">
      Submit your details or browse existing applications
    </p>

    <div className="grid gap-6 md:grid-cols-2">
      <Link to="/submit">
        <button className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-md hover:bg-green-700 transition">
          Submit Application
        </button>
      </Link>
      <Link to="/browse">
        <button className="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-md hover:bg-indigo-700 transition">
          Browse Applications
        </button>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit" element={<BiodataForm />} />
      <Route path="/browse" element={<BrowseApplications />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/browse/:year" element={<BrowseByYear />} />
    </Routes>
  );
}

export default App;
