import React, { useState } from "react";

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

          {[
            "date_of_birth",
            "time_of_birth",
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
            "contact_no1",
            "contact_no2",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/_/g, " ")}
              </label>
              <input
                type={field.includes("date") ? "date" : field.includes("time") ? "time" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}

          {/* Main Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Photo</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setMainPhoto)} />
          </div>

          {/* Side Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Side Photo</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSidePhoto)} />
          </div>
        </div>

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
