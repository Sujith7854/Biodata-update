import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const phone_number = location.state?.phone_number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/access/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number, otp }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error (verify-otp):", text);
        throw new Error(`Server returned ${res.status}`);
      }

      const data =
        contentType && contentType.includes("application/json")
          ? await res.json()
          : null;

      if (data?.success) {
        localStorage.setItem("is_verified", "true");
        alert("OTP verified! You can now browse applications.");
        navigate("/home");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!phone_number) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Phone number missing. Please register first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>

        <p className="text-center text-gray-600 mb-4">
          Enter the OTP sent to <strong>{phone_number}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
