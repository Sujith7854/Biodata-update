import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import OTPVerification from "./OTPVerification";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const RegisterAndOTPFlow = () => {
  const [step, setStep] = useState("register");
  const [userData, setUserData] = useState(null);
  const [mode, setMode] = useState("new"); // new or existing
  const [accessPurpose, setAccessPurpose] = useState(""); // "submit" or "browse"
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
          country: "", state: "", city: "", // dummy values
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {step === "register" && mode === "new" && (
        <div className="max-w-2xl mx-auto">
          <RegistrationForm onSubmit={handleRegistrationSuccess} />
          <div className="text-center mt-4">
            <button
              onClick={() => setMode("existing")}
              className="text-blue-600 underline"
            >
              Already Registered?
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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
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
