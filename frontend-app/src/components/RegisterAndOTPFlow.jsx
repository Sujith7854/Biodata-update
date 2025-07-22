import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import OTPVerification from "./OTPVerification";
import { useNavigate } from "react-router-dom";
import { Menu, ShieldCheck, User } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterAndOTPFlow = () => {
  const [step, setStep] = useState("register");
  const [userData, setUserData] = useState(null);
  const [mode, setMode] = useState("new");
  const [accessPurpose, setAccessPurpose] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationSuccess = (data, purpose) => {
    setUserData(data);
    setAccessPurpose(purpose);
    setStep("verify");
  };

  const handleExistingUserSubmit = async (name, phone, purpose) => {
    try {
      const res = await fetch(`${BASE_URL}/api/request-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone_number: phone,
          country: "", state: "", city: "",
          is_existing: true,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setUserData({ full_name: name, phone_number: phone });
        setAccessPurpose(purpose);
        setStep("verify");
      } else {
        alert(result.message || "User not found or failed to send OTP");
      }
    } catch (err) {
      console.error("Existing user error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  const handleOTPVerified = () => {
    if (accessPurpose === "submit") navigate("/submit");
    else navigate("/browse");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 relative">
      {/* 🔲 Floating Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Welcome</h1>
        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => navigate("/admin-login")}
            className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <ShieldCheck size={16} />
            Admin Login
          </button>
         <button
  onClick={() => navigate("/user-login")}
  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  <User size={16} />
  User Login
</button>
        </div>
      </header>

      {/* 🍔 Dropdown for Mobile */}
      {showMenu && (
        <div className="md:hidden absolute top-16 right-4 bg-white rounded shadow-lg w-48 z-50">
          <button
            onClick={() => {
              navigate("/admin-login");
              setShowMenu(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <ShieldCheck size={16} className="mr-2" />
            Admin Login
          </button>
          <button
  onClick={() => {
    navigate("/user-login"); 
    setShowMenu(false);       
  }}
  className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
>
  <User size={16} className="mr-2" />
  User Login
</button>
        </div>
      )}

      {/* Main Content */}
      {step === "register" && mode === "new" && (
        <div className="max-w-2xl mx-auto">
          <RegistrationForm onSubmit={handleRegistrationSuccess} />
          <div className="text-center mt-4">
            <button
              onClick={() => setMode("existing")}
              className="text-blue-600 underline"
            >
              Already Registered? Click here
            </button>
          </div>
        </div>
      )}

      {step === "register" && mode === "existing" && (
        <ExistingUserForm
          onSubmit={handleExistingUserSubmit}
          goBack={() => setMode("new")}
        />
      )}

      {step === "verify" && (
        <OTPVerification
          full_name={userData.full_name}
          phone_number={userData.phone_number}
          onSuccess={handleOTPVerified}
        />
      )}
    </div>
  );
};

const ExistingUserForm = ({ onSubmit, goBack }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("submit");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return alert("All fields are required");
    onSubmit(name, phone, purpose);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Verify Access</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Full Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Phone Number</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            type="tel"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Access Purpose</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="submit">Submit Application</option>
            <option value="browse">Browse Applications</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Get OTP
        </button>
        <div className="text-center mt-4">
          <button onClick={goBack} className="text-sm text-gray-600 underline">
            ← Back to Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterAndOTPFlow;
