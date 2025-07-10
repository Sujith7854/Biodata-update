import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BiodataForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "", // ✅ New gender field
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    height: "",
    birth_star: "",
    zodiac_sign: "",
    gothram: "",
    current_living: "",
    educational_details: "",
    designation: "",
    company: "",
    previous_work_experience: "",
    fathers_name: "",
    fathers_father_name: "",
    mothers_name: "",
    mothers_father_name: "",
    siblings: "",
    email_id: "",
    contact_no1: "",
    contact_no2: "",
    main_photo_base64: "",
    side_photo_base64: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(12);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && showPopup) {
      navigate("/home");
    }
  }, [countdown, showPopup, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        [key]: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/submit-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUniqueId(data.unique_id);
        setShowPopup(true);
        setCountdown(12);
      } else {
        console.error("❌ Submission failed:", data.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const getInputType = (field) => {
    if (field === "date_of_birth") return "date";
    if (field === "time_of_birth") return "time";
    if (field === "email_id") return "email";
    if (field.includes("contact")) return "tel";
    return "text";
  };

  const formFields = [
    "name",
    "date_of_birth", "time_of_birth", "place_of_birth", "height",
    "birth_star", "zodiac_sign", "gothram", "current_living", "educational_details",
    "designation", "company", "previous_work_experience",
    "fathers_name", "fathers_father_name", "mothers_name", "mothers_father_name",
    "siblings", "email_id", "contact_no1", "contact_no2",
  ];

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Biodata Form</h2>
      <button
              className="mb-4 text-sm text-blue-600 hover:underline"
              onClick={() => navigate("/home")}
            >
              ← Back
            </button>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Gender Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Remaining Fields */}
        {formFields.slice(1).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/_/g, " ")}
            </label>
            <input
              type={getInputType(field)}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        ))}

        {/* Image Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, "main_photo_base64")}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Side Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, "side_photo_base64")}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h3 className="text-xl font-bold text-green-600 mb-4">Application Submitted!</h3>
            <p className="mb-2">Your Unique ID:</p>
            <div className="text-2xl font-mono text-blue-700 mb-4">{uniqueId}</div>
            <p className="text-sm text-gray-600">Redirecting to home in {countdown} seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiodataForm;
