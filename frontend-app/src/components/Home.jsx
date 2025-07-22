import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Logout to registration page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 relative">
      {/* 🔴 Logout Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Biodata Application System
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Submit your details or browse existing applications
      </p>

      <div className="grid gap-6 md:grid-cols-3">
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

        <Link to="/manage-applications">
          <button className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-md hover:bg-blue-700 transition">
            Manage Applications
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
