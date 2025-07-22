import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserLogin = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phoneNumber) {
      return alert("All fields are required.");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/api/access/request-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phoneNumber,
          is_existing: true, // Important!
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully!");
        navigate("/verify-otp", { state: { phone_number: phoneNumber } });
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("OTP error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify Existing User
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Full Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending OTP..." : "Send OTP to Existing User"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 underline"
          >
            ← New user? Click here to register
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
