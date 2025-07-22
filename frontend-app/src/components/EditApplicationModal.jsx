import React, { useState } from "react";
const BASE_URL = "http://localhost:5050";

const EditApplicationModal = ({ application, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...application });
  const [mainPhoto, setMainPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handlePhotoUpload = (type) => {
    // 🔁 Optional: implement immediate upload if needed
    alert(`Uploading ${type} photo`);
  };

  const handleSubmit = () => {
    const photoFiles = {
      main_photo: mainPhoto,
      side_photo: sidePhoto,
    };
    onSave(formData, photoFiles);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Edit Application</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Other Fields */}
          {[
            "date_of_birth",
            "place_of_birth",
            "height",
            "birth_star",
            "zodiac_sign",
            "gothram",
            "current_living",
            "educational_details",
            "designation",
            "company",
            "previous_work_experience",
            "fathers_name",
            "fathers_father_name",
            "mothers_name",
            "mothers_father_name",
            "siblings",
            "email_id",
            "main_contact_number",
            "alternative_contact_number",
          ].map((field) => (
  <div key={field}>
    <label className="block text-sm font-medium text-gray-700 capitalize">
      {field.replace(/_/g, " ")}
    </label>
    <input
      type={
        field.includes("date")
          ? "date"
          : field.includes("time")
          ? "time"
          : "text"
      }
      name={field}
      value={
        field === "date_of_birth"
          ? formData[field]?.slice(0, 10) || ""
          : formData[field] || ""
      }
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
    />
  </div>
))}


          {/* Time of Birth in 12hr format */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Time of Birth</label>
            <input
              type="time"
              name="time_of_birth"
              value={formData.time_of_birth || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              step="60"
            />
            <p className="text-xs text-gray-500 mt-1">12hr format (with AM/PM) shown automatically by browser</p>
          </div>
        </div>

        {/* 📷 Photo Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* 🔷 Main Photo */}
          <div className="text-center">
            <h4 className="font-semibold mb-2">Main Photo</h4>
            {formData.main_photo_url ? (
              <img
                src={`${BASE_URL}/uploads/${formData.main_photo_url.replace(/\\/g, "/")}`}
                alt="Main"
                className="w-full h-[180px] object-contain border rounded shadow"
              />
            ) : (
              <p className="text-sm text-gray-500 mb-2">No main photo uploaded.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setMainPhoto)}
              className="mt-2"
            />
            <button
              type="button"
              onClick={() => handlePhotoUpload("main")}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Update Main Photo
            </button>
          </div>

          {/* 🔷 Side Photo */}
          <div className="text-center">
            <h4 className="font-semibold mb-2">Side Photo</h4>
            {formData.side_photo_url ? (
              <img
                src={`${BASE_URL}/uploads/${formData.side_photo_url.replace(/\\/g, "/")}`}
                alt="Side"
                className="w-full h-[180px] object-contain border rounded shadow"
              />
            ) : (
              <p className="text-sm text-gray-500 mb-2">No side photo uploaded.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setSidePhoto)}
              className="mt-2"
            />
            <button
              type="button"
              onClick={() => handlePhotoUpload("side")}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Update Side Photo
            </button>
          </div>
        </div>

        {/* ✅ Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditApplicationModal;
