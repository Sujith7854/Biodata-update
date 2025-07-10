import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    country: "",
    state: "",
    city: "",
  });

  const [isExistingUser, setIsExistingUser] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch countries on load
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCountries(data.data.map((c) => c.name).sort());
        }
      });
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (form.country) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: form.country }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.states) {
            setStates(data.data.states.map((s) => s.name));
            setForm((prev) => ({ ...prev, state: "", city: "" }));
            setCities([]);
          }
        });
    }
  }, [form.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (form.country && form.state) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: form.country,
          state: form.state,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setCities(data.data);
            setForm((prev) => ({ ...prev, city: "" }));
          }
        });
    }
  }, [form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form, is_existing: isExistingUser };

      const res = await fetch("http://localhost:5050/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent to your phone number (check console)");
        navigate("/verify-otp", { state: { phone_number: form.phone_number } });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error");
    }
  };

  const toggleMode = () => {
    setIsExistingUser(!isExistingUser);
    setForm({
      full_name: "",
      phone_number: "",
      country: "",
      state: "",
      city: "",
    });
    setStates([]);
    setCities([]);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isExistingUser ? "Verify Existing User" : "Register to Browse"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter full name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter phone number"
            type="tel"
          />
        </div>

        {!isExistingUser && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {states.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {cities.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">City</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {isExistingUser ? "Send OTP to Existing User" : "Submit & Get OTP"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 underline text-sm"
          >
            {isExistingUser
              ? "← New user? Click here to register"
              : "Already registered? Click here"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
